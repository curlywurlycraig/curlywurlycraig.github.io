// Formula parsing functions

// basic idea:
// mark current character
// iterate through characters
// track most recent "valid" range
//     (not including "valid but incomplete")
// Keep going until an invalid state is encountered.
// if an invalid state is encountered, categorise and lex that range

// + operator is simply
// +
// <plus operator>

// - operator is simply
// -
// <neg operator>

typedef enum CharType {
    START,
    DIGIT,
    HYPHEN,
    PERIOD,
    ASTERISK,
    PLUS,
    SPACE,
    END,
    UNKNOWN
} CharType;

typedef enum Validity {
    INVALID,
    PARTIAL,
    VALID
} Validity;

typedef enum Token {
    NO_TOKEN,
    NUMBER,
    OP_MULT,
    OP_NEG,
    OP_PLUS,
    WHITESPACE
} Token;

typedef struct CharState {
    int id;
    CharType type;
} CharState;

typedef struct StateTransition {
    CharState fromState;
    CharState toState;
} StateTransition;

typedef struct TokenFinder {
    StateTransition *transitions;
    unsigned int transitionCount;
    Token token;
} TokenFinder;

#define MAX_TOKENS 256
#define MAX_FINDERS 16

TokenFinder *tokenFinders;
unsigned int numTokenFinders;

CharState startState;
CharState endState;

CharType getCharType(char input) {
    if (input >= '0' && input <= '9') {
        return DIGIT;
    }

    if (input == '.') {
        return PERIOD;
    }

    if (input == ' ') {
        return SPACE;
    }

    if (input == '+') {
        return PLUS;
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

    // number is
    // 1
    // 1018585
    // 12383.1583
    // NOT 123415. (don't allow trailing period)
    // <some digits><maybe period & more digits>
    TokenFinder numberFinder;
    numberFinder.token = NUMBER;
    numberFinder.transitionCount = 7;
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

    return numberFinder;
}

TokenFinder makeAsteriskFinder() {
    CharState asteriskState;
    asteriskState.id = 0;
    asteriskState.type = ASTERISK;

    TokenFinder asteriskFinder;
    asteriskFinder.token = OP_MULT;
    asteriskFinder.transitionCount = 2;
    asteriskFinder.transitions = mmalloc(sizeof(StateTransition) * asteriskFinder.transitionCount);

    asteriskFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = asteriskState
    };
    asteriskFinder.transitions[1] = (StateTransition) {
        .fromState = asteriskState,
        .toState = endState
    };

    return asteriskFinder;
}

TokenFinder makePlusFinder() {
    CharState plusState;
    plusState.id = 0;
    plusState.type = PLUS;

    TokenFinder plusFinder;
    plusFinder.token = OP_PLUS;
    plusFinder.transitionCount = 2;
    plusFinder.transitions = mmalloc(sizeof(StateTransition) * plusFinder.transitionCount);

    plusFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = plusState
    };
    plusFinder.transitions[1] = (StateTransition) {
        .fromState = plusState,
        .toState = endState
    };

    return plusFinder;
}

TokenFinder makeWhitespaceFinder() {
    CharState whitespaceState;
    whitespaceState.id = 0;
    whitespaceState.type = SPACE;

    TokenFinder whitespaceFinder;
    whitespaceFinder.token = WHITESPACE;
    whitespaceFinder.transitionCount = 3;
    whitespaceFinder.transitions = mmalloc(sizeof(StateTransition) * whitespaceFinder.transitionCount);

    whitespaceFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = whitespaceState
    };
    whitespaceFinder.transitions[1] = (StateTransition) {
        .fromState = whitespaceState,
        .toState = whitespaceState
    };
    whitespaceFinder.transitions[2] = (StateTransition) {
        .fromState = whitespaceState,
        .toState = endState
    };

    return whitespaceFinder;
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
    tokenFinders[1] = makeAsteriskFinder();
    numTokenFinders++;
    tokenFinders[2] = makePlusFinder();
    numTokenFinders++;
    tokenFinders[3] = makeWhitespaceFinder();
    numTokenFinders++;
}

// Lexer

typedef struct TokenInfo {
    Validity validity;
    Token token;
    int startIndex;
    int endIndex;
} TokenInfo;

typedef struct TokenizeResult {
    TokenInfo *tokens;
    int tokenCount;
} TokenizeResult;

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
        bestToken = NO_TOKEN;

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

            if (anyValid == 0 && bestToken != NO_TOKEN) {
                TokenInfo newToken;
                newToken.token = bestToken;
                newToken.validity = VALID;
                newToken.startIndex = startIndex;
                newToken.endIndex = bestEndIndex;
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
            result.tokens[result.tokenCount] = newToken;
            result.tokenCount++;
        }
    }

    return result;
}