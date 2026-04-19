// Keep quiet.
const MAX_RESPONSE_SIZE = 15;

function isInterestingWord(word) {
    const stopWords = new Set([
        "the", "a", "an", "and", "or", "but", "if", "then", "to", "of", "in", "on", "at",
        "for", "with", "by", "is", "are", "was", "were", "be", "been", "it", "this",
        "that", "i", "you", "me", "my", "your", "we", "they", "them", "he", "she"
    ]);

    return word.length >= 4 && !stopWords.has(word);
}

async function prepareMarkov() {
    let text = "";
    let textFetch = await fetch("shadow.txt");
    text += await textFetch.text();
    textFetch = await fetch("illiad.txt");
    text += "\n" + await textFetch.text();
    textFetch = await fetch("dangerous.txt");
    text += "\n" + await textFetch.text();
    textFetch = await fetch("silicon.txt");
    text += "\n" + await textFetch.text();

    let processedText = tokenize(normalizeText(text));
    return buildMarkov(processedText, 1);
}

function normalizeText(input) {
    let text = input;

    text = text
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/[`]/g, "'");

    text = text
        .replace(/--/g, " , ")
        .replace(/[—–]/g, " , ")
        .replace(/;/g, " , ")
        .replace(/:/g, " , ");

    text = text
        .replace(/[\[\]\(\)\{\}_*]/g, " ")
        .replace(/\d+\*/g, " ")
        .replace(/\d+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\n/g, " ")
        .trim();

    text = text.toLowerCase()

    return text;
}

function tokenize(inputText) {
    return inputText
        .replace(/\s+/g, " ")
        .replace(/([\'\"])/g, " \$1 ")
        .replace("...", " <ELLIPSIS_CREAG> ")
        .replace(/([,.!?])/g, " \$1 ")
        .replace(" <ELLIPSIS_CREAG> ", " ... ")
        .trim()
        .split(" ")
        .filter(token => token.length);
}

function render(tokens) {
    return tokens.reduce((acc, curr) => {
        if ([",", ".", "\"", "\'", "!", "?"].includes(curr)) {
            return acc + curr;
        }

        return acc + " " + curr;
    });
}

function buildMarkov(tokens, order = 1) {
    const result = {};

    for (let i = order; i < tokens.length; i++) {
        const key = [];
        for (let j = i - order; j < i; j++) {
            key.push(tokens[j]);
        }

        if (result[key] === undefined) {
            result[key] = {};
        }

        if (result[key][tokens[i]] === undefined) {
            result[key][tokens[i]] = 0
        }

        result[key][tokens[i]] += 1;
    }

    return result;
}

function generate(markov, prompt) {
    const promptTokens = tokenize(normalizeText(prompt));
    let result = promptTokens;
    for (let i = 0; i < MAX_RESPONSE_SIZE; i++) {
        const availableNext = markov[result[result.length - 1]];
        const totalTokenSamples = Object.values(availableNext).reduce((acc, curr) => acc + curr);
        let randomRoll = Math.floor(Math.random() * totalTokenSamples);
        let next = null;

        for (key of Object.keys(availableNext)) {
            if (randomRoll <= 10) {
                next = key;
                break;
            }
            randomRoll -= availableNext[key];
        }
        result.push(next);

        if (next === ".") {
            console.log("ope.")
            return result;
        }
    }

    return result;
}

function reply(markov, input) {
    const inputTokens = tokenize(normalizeText(input));
    for (word of inputTokens) {
        // TODO: Implement this heuristic:
        // Is the user asking a question? Somehow answer with a definitive.
        // Does the user say an interesting word that has an entry in the chain?
        // Otherwise, just ramble or pick from a set of phrases.

        // Also sometimes do short, sometimes do 

        if (isInterestingWord(word) && markov[word]) {
            // TODO We can dispatch this to multiple different possible options. e.g.,
            // we don't have to start with repeating and the question mark. We could say, "well... ${result}"

            const result = render([word, "?"].concat(generate(markov, word)))
            if (![".", "?", "!"].includes(result[result.length-1])) {
                return result + "..."
            } else {
                return result;
            }
        }
    }
}

let markov = null;
prepareMarkov().then(m => {
    markov = m
});


/* html bits */

document.getElementById("chat-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const text = document.getElementById("text-input").value;
    console.log(reply(markov, text));
});