#include "parse.h"
#include "mem.h"
#include "string.h"
#include "math.h"

TokenFinder* tokenFinders;
unsigned int numTokenFinders;

CharState startState;
CharState endState;

CharType getCharType(char input) {
    if (input >= '0' && input <= '9') {
        return DIGIT;
    }

    if ((input >= 'a' && input <= 'z') || (input >= 'A' && input <= 'Z')) {
        return LETTER;
    }

    if (input == ' ') {
        return SPACE;
    }

    if (input == '\n') {
        return SPACE;
    }

    if (input == '.') {
        return PERIOD;
    }

    if (input == '-') {
        return HYPHEN;
    }

    // Operators
    if (input == '*') {
        return LETTER;
    }

    if (input == '+') {
        return LETTER;
    }

    if (input == '/') {
        return LETTER;
    }

    // Boolean functions like empty?
    if (input == '?') {
        return LETTER;
    }

    if (input == '(') {
        return OPEN_PAREN;
    }

    if (input == ')') {
        return CLOSE_PAREN;
    }

    if (input == ':') {
        return COLON;
    }

    return UNKNOWN;
}

Validity validateRange(char* range, int startIndex, int endIndex, TokenFinder finder) {
    CharState currentCharState = startState;
    for (int i = startIndex; i < endIndex; i++) {
        CharType nextCharType = getCharType(range[i]);
        int hasValidTransition = 0;
        // find matching transition
        for (int j = 0; j < finder.transitionCount; j++) {
            StateTransition transition = finder.transitions[j];
            // TODO This will allow repeating periods in number. Need to
            if (transition.fromState.id == currentCharState.id && transition.toState.type == nextCharType) {
                hasValidTransition = 1;

                currentCharState = transition.toState;
                break;
            }
        }

        if (!hasValidTransition) {
            return INVALID;
        }
    }

    for (int i = 0; i < finder.transitionCount; i++) {
        StateTransition transition = finder.transitions[i];
        if (transition.fromState.id == currentCharState.id && transition.toState.id == endState.id) {
            return VALID;
        }
    }

    return PARTIAL;
}

TokenFinder makeCellrefFinder() {
    CharState colonState;
    colonState.id = 0;
    colonState.type = COLON;

    CharState letterState;
    letterState.id = 1;
    letterState.type = LETTER;

    CharState numberState;
    numberState.id = 2;
    numberState.type = DIGIT;

    CharState hyphenState;
    hyphenState.id = 3;
    hyphenState.type = HYPHEN;

    TokenFinder cellrefFinder;
    cellrefFinder.token = T_CELLREF;
    cellrefFinder.transitionCount = 9;
    cellrefFinder.transitions = mmalloc(sizeof(StateTransition) * cellrefFinder.transitionCount);

    cellrefFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = colonState
    };
    cellrefFinder.transitions[1] = (StateTransition) {
        .fromState = colonState,
        .toState = letterState
    };
    cellrefFinder.transitions[2] = (StateTransition) {
        .fromState = letterState,
        .toState = numberState
    };
    cellrefFinder.transitions[3] = (StateTransition) {
        .fromState = numberState,
        .toState = endState
    };
    cellrefFinder.transitions[4] = (StateTransition) {
        .fromState = letterState,
        .toState = letterState
    };
    cellrefFinder.transitions[5] = (StateTransition) {
        .fromState = numberState,
        .toState = numberState
    };
    cellrefFinder.transitions[6] = (StateTransition) {
        .fromState = numberState,
        .toState = hyphenState
    };
    cellrefFinder.transitions[7] = (StateTransition) {
        .fromState = hyphenState,
        .toState = colonState
    };
    cellrefFinder.transitions[8] = (StateTransition) {
        .fromState = letterState,
        .toState = endState
    };

    return cellrefFinder;
}

TokenFinder makeNumberFinder() {
    CharState numberState;
    numberState.id = 0;
    numberState.type = DIGIT;

    CharState periodState;
    periodState.id = 1;
    periodState.type = PERIOD;

    CharState fractionState;
    fractionState.id = 2;
    fractionState.type = DIGIT;

    CharState hyphenState;
    hyphenState.id = 3;
    hyphenState.type = HYPHEN;

    // number is
    // 1
    // 1018585
    // 12383.1583
    // -12383.1583
    // NOT 123415. (don't allow trailing period)
    // <some digits><maybe period & more digits>
    TokenFinder numberFinder;
    numberFinder.token = T_NUMBER;
    numberFinder.transitionCount = 9;
    numberFinder.transitions = mmalloc(sizeof(StateTransition) * numberFinder.transitionCount);

    numberFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = numberState
    };
    numberFinder.transitions[1] = (StateTransition) {
        .fromState = numberState,
        .toState = endState
    };
    numberFinder.transitions[2] = (StateTransition) {
        .fromState = numberState,
        .toState = periodState
    };
    numberFinder.transitions[3] = (StateTransition) {
        .fromState = numberState,
        .toState = numberState
    };
    numberFinder.transitions[4] = (StateTransition) {
        .fromState = periodState,
        .toState = fractionState
    };
    numberFinder.transitions[5] = (StateTransition) {
        .fromState = fractionState,
        .toState = endState
    };
    numberFinder.transitions[6] = (StateTransition) {
        .fromState = fractionState,
        .toState = fractionState
    };

    // Neg numbers
    numberFinder.transitions[7] = (StateTransition) {
        .fromState = startState,
        .toState = hyphenState
    };
    numberFinder.transitions[8] = (StateTransition) {
        .fromState = hyphenState,
        .toState = numberState
    };

    return numberFinder;
}

TokenFinder makeSingleCharacterFinder(CharType type, Token token) {
    CharState charState;
    charState.id = 0;
    charState.type = type;

    TokenFinder charFinder;
    charFinder.token = token;
    charFinder.transitionCount = 2;
    charFinder.transitions = mmalloc(sizeof(StateTransition) * charFinder.transitionCount);

    charFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = charState
    };
    charFinder.transitions[1] = (StateTransition) {
        .fromState = charState,
        .toState = endState
    };

    return charFinder;
}

TokenFinder makeRepeatingCharacterFinder(CharType type, Token token) {
    CharState charState;
    charState.id = 0;
    charState.type = type;

    TokenFinder charFinder;
    charFinder.token = token;
    charFinder.transitionCount = 3;
    charFinder.transitions = mmalloc(sizeof(StateTransition) * charFinder.transitionCount);

    charFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = charState
    };
    charFinder.transitions[1] = (StateTransition) {
        .fromState = charState,
        .toState = charState
    };
    charFinder.transitions[2] = (StateTransition) {
        .fromState = charState,
        .toState = endState
    };

    return charFinder;
}

TokenFinder makeIdentifierFinder() {
    CharState charState;
    charState.id = 0;
    charState.type = LETTER;

    CharState hyphenState;
    hyphenState.id = 1;
    hyphenState.type = HYPHEN;

    TokenFinder identFinder;
    identFinder.token = T_IDENT;
    identFinder.transitionCount = 6;
    identFinder.transitions = mmalloc(sizeof(StateTransition) * identFinder.transitionCount);

    identFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = charState
    };
    identFinder.transitions[1] = (StateTransition) {
        .fromState = startState,
        .toState = hyphenState
    };
    identFinder.transitions[2] = (StateTransition) {
        .fromState = charState,
        .toState = charState
    };
    identFinder.transitions[3] = (StateTransition) {
        .fromState = charState,
        .toState = endState
    };
    identFinder.transitions[4] = (StateTransition) {
        .fromState = hyphenState,
        .toState = charState
    };
    identFinder.transitions[5] = (StateTransition) {
        .fromState = hyphenState,
        .toState = endState
    };

    return identFinder;
}

TokenFinder makeOpenParenFinder() {
    return makeSingleCharacterFinder(OPEN_PAREN, T_OPEN_PAREN);
}

TokenFinder makeCloseParenFinder() {
    return makeSingleCharacterFinder(CLOSE_PAREN, T_CLOSE_PAREN);
}

TokenFinder makeWhitespaceFinder() {
    return makeRepeatingCharacterFinder(SPACE, T_WHITESPACE);
}

void initTokenFinders() {
    startState.id = -1;
    startState.type = START;

    endState.id = -2;
    endState.type = END;

    numTokenFinders = 0;
    tokenFinders = mmalloc(sizeof(TokenFinder) * MAX_FINDERS);

    tokenFinders[0] = makeNumberFinder();
    numTokenFinders++;
    tokenFinders[1] = makeWhitespaceFinder();
    numTokenFinders++;
    tokenFinders[2] = makeOpenParenFinder();
    numTokenFinders++;
    tokenFinders[3] = makeCloseParenFinder();
    numTokenFinders++;
    tokenFinders[4] = makeIdentifierFinder();
    numTokenFinders++;
    tokenFinders[5] = makeCellrefFinder();
    numTokenFinders++;
}

TokenizeResult tokenize(char* formula) {
    TokenizeResult result;
    result.tokens = mmalloc(sizeof(TokenInfo) * MAX_TOKENS);
    result.tokenCount = 0;
    Token bestToken;
    int startIndex = 0;
    int endIndex = 1;
    int bestStartIndex = 0;
    int bestEndIndex = 0;

    int formulaLen = strlen(formula);
    while (startIndex < formulaLen) {
        bestToken = T_NO_TOKEN;

        while (endIndex <= formulaLen) {
            int anyValid = 0;
            for (int i = 0; i < numTokenFinders; i++) {
                TokenFinder tokenFinder = tokenFinders[i];
                Validity validity = validateRange(formula, startIndex, endIndex, tokenFinder);
                if (validity == VALID) {
                    anyValid = 1;
                    bestToken = tokenFinder.token;
                    bestEndIndex = endIndex;
                    bestStartIndex = startIndex;
                    break;
                } else if (validity == PARTIAL) {
                    anyValid = 1;
                }
            }

            if (anyValid == 0 && bestToken != T_NO_TOKEN) {
                TokenInfo newToken;
                newToken.token = bestToken;
                newToken.validity = VALID;
                newToken.startIndex = startIndex;
                newToken.endIndex = bestEndIndex;
                newToken.raw = mmalloc(sizeof(char) * MAX_TOKEN_LENGTH);
                strcpy(newToken.raw, formula, newToken.startIndex, newToken.endIndex);
                result.tokens[result.tokenCount] = newToken;
                result.tokenCount++;
                startIndex = bestEndIndex - 1;
                endIndex = startIndex;
                break;
            }

            endIndex++;
        }

        startIndex++;
    }

    // Do one final check
    for (int i = 0; i < numTokenFinders; i++) {
        TokenFinder tokenFinder = tokenFinders[i];
        Validity validity = validateRange(formula, bestStartIndex, endIndex - 1, tokenFinder);
        if (validity == VALID) {
            TokenInfo newToken;
            newToken.token = tokenFinder.token;
            newToken.validity = VALID;
            newToken.startIndex = bestStartIndex;
            newToken.endIndex = endIndex - 1;
            newToken.raw = mmalloc(sizeof(char) * MAX_TOKEN_LENGTH);
            strcpy(newToken.raw, formula, newToken.startIndex, newToken.endIndex);
            result.tokens[result.tokenCount] = newToken;
            result.tokenCount++;
        }
    }

    return result;
}

// Parse

TokenInfo lookAhead(ParseInfo *info, int ahead) {
    return info->tokenizeResult->tokens[info->tokenIndex + ahead];
}

void error(ParseInfo *info) {
    info->didFail = 1;
    info->reachedEnd = 0;
}

void next(ParseInfo *info) {
    info->tokenIndex++;
    if (info->tokenIndex >= info->tokenizeResult->tokenCount) {
        info->reachedEnd = 1;
    }
}

int expectk(ParseInfo *info, Token token, int k) {
    TokenInfo currToken = lookAhead(info, k-1);
    return currToken.token == token;
}

int expect(ParseInfo *info, Token token) {
    return expectk(info, token, 1);
}

void consume(ParseInfo *info, Token token) {
    if (!expect(info, token)) {
        error(info);
        return;
    }
    next(info);
}

TokenInfo last(ParseInfo *info) {
    return lookAhead(info, -1);
}

// left recursive grammar
// ----
// list : ( elem... )

// elem : list
// elem : ident

// ident : func
// ident : number
// ident : string
// ident : cellrange

List* list(ParseInfo *info) {
    List* result = mmalloc(sizeof(List));

    consume(info, T_OPEN_PAREN);
    if (info->didFail) return 0;

    // Function token is just for evalling

    Elem** elems = mmalloc(sizeof(Elem*) * 128);
    unsigned int argc = 0;
    while (!expect(info, T_CLOSE_PAREN) && !info->didFail) {
        // Obviously a bad way to do this
        if (argc > 20) {
            info->didFail = 1;
            return 0;
        }

        Elem* currElem = elem(info);
        elems[argc] = currElem;
        argc++;
    }

    consume(info, T_CLOSE_PAREN);

    if (expect(info, T_WHITESPACE)) {
        consume(info, T_WHITESPACE);
    }

    result->elems = elems;
    result->elemCount = argc;

    return result;
}

Elem* elem(ParseInfo *info) {
    Elem* result = mmalloc(sizeof(Elem));

    if (expect(info, T_OPEN_PAREN)) {
        List* listResult = list(info);
        result->type = E_LIST;
        result->val.list = listResult;
        return result;
    }

    if (expect(info, T_WHITESPACE)) {
        consume(info, T_WHITESPACE);
    }

    if (expect(info, T_NUMBER)) {
        TokenInfo currToken = lookAhead(info, 0);
        double a = ctod(currToken.raw);
        consume(info, T_NUMBER);

        if (expect(info, T_WHITESPACE)) {
            consume(info, T_WHITESPACE);
        }

        result->type = E_IDENT;
        result->val.ident = (Ident) {
            .type = I_NUM,
            .val = { .num = a }
        };
        return result;
    }

    if (expect(info, T_CELLREF)) {
        TokenInfo currToken = lookAhead(info, 0);
        consume(info, T_CELLREF);

        if (expect(info, T_WHITESPACE)) {
            consume(info, T_WHITESPACE);
        }

        result->type = E_IDENT;
        result->val.ident = (Ident) {
            .type = I_CELLRANGE,
            .val = { .name = currToken.raw }
        };
        return result;
    }

    if (expect(info, T_IDENT)) {
        TokenInfo currToken = lookAhead(info, 0);
        consume(info, T_IDENT);

        if (expect(info, T_WHITESPACE)) {
            consume(info, T_WHITESPACE);
        }

        result->type = E_IDENT;
        result->val.ident = (Ident) {
            .type = I_VAR,
            .val = { .name = currToken.raw }
        };
        return result;
    }


    return 0;
}
