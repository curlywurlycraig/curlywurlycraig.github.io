export class ParseContext {
    tokens = [];
    raw = "";
    idx = 0;

    constructor(inp) {
        this.raw = inp;
    }

    isAtEnd() {
        return this.idx >= this.raw.length;
    }
}

const isAlpha = (c) => {
    return (
        (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9'));
}

const isDigit = (c) => {
    return c >= '0' && c <= '9';
}

const isWhitespace = (c) => {
    return (c === '\n' || c === ' ' || c === '\t');
}

const parseUntil = (parser) => (ctx) => {
    const startIndex = ctx.idx;
    while (!parser(ctx)) {
        if (ctx.isAtEnd()) {
            ctx.idx = startIndex;
            return null;
        }

        ctx.idx++;
    }

    const endIndex = ctx.idx;
    ctx.idx = startIndex;
    return {
        start: startIndex,
        end: endIndex
    };
}

const parseEnd = () => (ctx) => {
    if (ctx.isAtEnd()) {
        return {
            start: ctx.idx,
            end: ctx.idx
        };
    }

    return null;
}

const parseWhileChar = (charCond) => (ctx) => {
    const startIndex = ctx.idx;
    let endIndex = startIndex;
    while (charCond(ctx.raw[endIndex]) && ctx.raw[endIndex] !== undefined) {
        endIndex++;
    }

    if (endIndex > startIndex) {
        return {
            start: startIndex,
            end: endIndex
        };
    }
}

const maybe = (parser) => (ctx) => {
    const result = parser(ctx);
    return result || {
        start: ctx.idx,
        end: ctx.idx
    };
}

const parseAlphanumeric = parseWhileChar(isAlpha);

const parseDigits = parseWhileChar(isDigit);

const parseCharacterCond = (cond) => (ctx) => {
    if (cond(ctx.raw[ctx.idx])) {
        return {
            start: ctx.idx,
            end: ctx.idx + 1
        }
    }
}

const whitespace = parseCharacterCond(isWhitespace);

const parseCharacter = (ch) => parseCharacterCond(c => c === ch);

const nonAlpha = parseCharacterCond(c => !isAlpha(c));

const parseString = (str) => {
    const parsers = [];
    for (let i = 0; i < str.length; i++) {
        parsers.push(parseCharacter(str[i]));
    }

    return sequence(...parsers);
}

// Returns null if any of the and fail, and resets.
// If the whole sequence of parsers succeeds to parse, returns a token span
const sequence = (...parsers) => (ctx) => {
    const startIdx = ctx.idx;
    let totalLength = 0;
    for (let i = 0; i < parsers.length; i++) {
        const parseResult = parsers[i](ctx);
        if (!parseResult) {
            // Reset the context index
            ctx.idx = startIdx;
            return null;
        }

        ctx.idx += (parseResult.end - parseResult.start);
        totalLength += (parseResult.end - parseResult.start);
    }

    ctx.idx = startIdx;
    return {
        start: ctx.idx,
        end: ctx.idx + totalLength
    }
}

const drop = (parser) => (ctx) => {
    const currIdx = ctx.idx;
    const result = parser(ctx);
    if (!result) {
        return;
    }

    ctx.idx += (result.end - result.start);
    return {
        start: currIdx,
        end: currIdx 
    };
}

const consume = (parser, type) => (ctx) => {
    const result = parser(ctx);
    if (!result) {
        return;
    }

    result.type = type;
    result.parser = parser;
    ctx.tokens.push(result);
    ctx.idx = result.end;
    return result;
}

const untilEnd = (parser) => (ctx) => {
    while (ctx.raw[ctx.idx] !== undefined) {
        parser(ctx);
    }
}

const or = (...parsers) => (ctx) => {
    for (let i = 0; i < parsers.length; i++) {
        const result = parsers[i](ctx);
        if (result) {
            return result;
        }
    }
}

// Returns the resulting token, but with length 0.
// Useful for including at the end of an "sequence" parser, when you don't
// want to include the final parsed result
const peek = (parser) => (ctx) => {
    const result = parser(ctx);
    if (!result) {
        return;
    }

    return {
        ...result,
        end: result.start
    };
}

// Jumps back an amount, tries the parser, then jumps back, returning the result (with length 0)
// Useful for including at the beginning of an "sequence" parser
// when you don't want to include in the final parsed result
const peekBack = (parser, amount = 1) => (ctx) => {
    const origIdx = ctx.idx;
    ctx.idx = ctx.idx - amount;
    const result = parser(ctx);
    if (!result) {
        ctx.idx = origIdx;
        return;
    }

    ctx.idx = origIdx;
    return {
        start: origIdx,
        end: origIdx
    };
}

const one = () => (ctx) => {
    return {
        start: ctx.idx,
        end: ctx.idx + 1
    };
}

const funcCallName = sequence(
    parseAlphanumeric,
    peek(parseCharacter("("))
);

const comment = or(
    sequence(
        parseString("//"),
        maybe(parseWhileChar(c => c !== '\n'))
    ),
    sequence(
        parseString("/*"),
        parseUntil(
            or(
                parseString("*/"),
                parseEnd(),
            )
        ),
        maybe(parseString("*/"))
    )
)

const string = or(
    sequence(
        parseCharacter('"'),
        maybe(parseWhileChar(c => c !== '"')),
        parseCharacter('"')
    ),
    sequence(
        parseCharacter("'"),
        maybe(parseWhileChar(c => c !== "'")),
        parseCharacter("'")
    )
);

const number = sequence(
    parseDigits,
    maybe(parseCharacter('.')),
    maybe(parseDigits)
);

const startOfInput = (ctx) => {
    if (ctx.idx === 0) {
        return {
            start: 0,
            end: 0
        }
    }

    return null;
}

const endOfInput = (ctx) => {
    if (ctx.idx === ctx.raw.length) {
        return {
            start: ctx.idx,
            end: ctx.idx
        }
    }

    return null;
}

const keyword = (str) => sequence(
    or(
        startOfInput,
        peekBack(nonAlpha)
    ),
    parseString(str),
    peek(or(
        endOfInput,
        nonAlpha
    ))
);

export const parseJSON = untilEnd(
    or(
        consume(string, "STRING"),
        consume(number, "NUMBER"),
        consume(keyword("null"), "KEYWORD"),
        consume(keyword("undefined"), "KEYWORD"),
        drop(one())
    )
)
