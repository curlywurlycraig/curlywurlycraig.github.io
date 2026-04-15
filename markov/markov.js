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
    return tokens.join(" ");
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
    }

    return result;
}

function reply(markov, input) {
    const inputTokens = tokenize(normalizeText(input));
    for (word of inputTokens) {
        if (isInterestingWord(word) && markov[word]) {
            return render([word, "?"].concat(generate(markov, word)))
        }
    }
}

let markov = null;
prepareMarkov().then(m => {
    markov = m
});
