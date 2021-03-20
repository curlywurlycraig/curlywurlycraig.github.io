typedef enum CharType {
    START,
    DIGIT,
    HYPHEN,
    PERIOD,
    ASTERISK,
    PLUS,
    SPACE,
    OPEN_PAREN,
    CLOSE_PAREN,
    END,
    UNKNOWN
} CharType;

typedef enum Validity {
    INVALID,
    PARTIAL,
    VALID
} Validity;

typedef enum Token {
    T_NO_TOKEN,
    T_NUMBER,
    T_MULT,
    T_NEG,
    T_PLUS,
    T_OPEN_PAREN,
    T_CLOSE_PAREN,
    T_WHITESPACE
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

    if (input == '-') {
        return HYPHEN;
    }

    if (input == '*') {
        return ASTERISK;
    }

    if (input == '(') {
        return OPEN_PAREN;
    }

    if (input == ')') {
        return CLOSE_PAREN;
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
    numberFinder.token = T_NUMBER;
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
    asteriskFinder.token = T_MULT;
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

TokenFinder makeOpenParenFinder() {
    CharState parenState;
    parenState.id = 0;
    parenState.type = OPEN_PAREN;

    TokenFinder openParenFinder;
    openParenFinder.token = T_OPEN_PAREN;
    openParenFinder.transitionCount = 2;
    openParenFinder.transitions = mmalloc(sizeof(StateTransition) * openParenFinder.transitionCount);

    openParenFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = parenState
    };
    openParenFinder.transitions[1] = (StateTransition) {
        .fromState = parenState,
        .toState = endState
    };

    return openParenFinder;
}

TokenFinder makeCloseParenFinder() {
    CharState parenState;
    parenState.id = 0;
    parenState.type = CLOSE_PAREN;

    TokenFinder closeParenFinder;
    closeParenFinder.token = T_CLOSE_PAREN;
    closeParenFinder.transitionCount = 2;
    closeParenFinder.transitions = mmalloc(sizeof(StateTransition) * closeParenFinder.transitionCount);

    closeParenFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = parenState
    };
    closeParenFinder.transitions[1] = (StateTransition) {
        .fromState = parenState,
        .toState = endState
    };

    return closeParenFinder;
}

TokenFinder makePlusFinder() {
    CharState plusState;
    plusState.id = 0;
    plusState.type = PLUS;

    TokenFinder plusFinder;
    plusFinder.token = T_PLUS;
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

TokenFinder makeMinusFinder() {
    CharState minusState;
    minusState.id = 0;
    minusState.type = HYPHEN;

    TokenFinder minusFinder;
    minusFinder.token = T_NEG;
    minusFinder.transitionCount = 2;
    minusFinder.transitions = mmalloc(sizeof(StateTransition) * minusFinder.transitionCount);

    minusFinder.transitions[0] = (StateTransition) {
        .fromState = startState,
        .toState = minusState
    };
    minusFinder.transitions[1] = (StateTransition) {
        .fromState = minusState,
        .toState = endState
    };

    return minusFinder;
}

TokenFinder makeWhitespaceFinder() {
    CharState whitespaceState;
    whitespaceState.id = 0;
    whitespaceState.type = SPACE;

    TokenFinder whitespaceFinder;
    whitespaceFinder.token = T_WHITESPACE;
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
    tokenFinders[4] = makeOpenParenFinder();
    numTokenFinders++;
    tokenFinders[5] = makeCloseParenFinder();
    numTokenFinders++;
    tokenFinders[6] = makeMinusFinder();
    numTokenFinders++;
}

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

void printTokens(TokenizeResult result) {
    for (int i=0; i < result.tokenCount; i++) {
        printf(result.tokens[i].token);
    }
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

// Interpreter

typedef struct ParseInfo {
    int tokenIndex;
    int didFail;
    int reachedEnd;
    double result;
    TokenizeResult *tokenizeResult;
    char* raw;
} ParseInfo;

TokenInfo lookAhead(ParseInfo *info, int ahead) {
    return info->tokenizeResult->tokens[info->tokenIndex + ahead];
}

double parseNumToken(TokenInfo numToken, char* raw) {
    return ctod(raw, numToken.startIndex, numToken.endIndex);
}

// left recursive grammar
// ----
// expression : expression + expression
// expression : expression * expression
// expression : number
// expression : ( expression )

// with left recursion removed
// ----
// Expression : Term ExpressionA

// ExpressionA : + Term ExpressionA
// ExpressionA : <nothing>

// Term : Factor TermM

// TermM : * Factor TermM
// TermM : <nothing>

// Factor : ( Expression )
// Factor : -number
// Factor : -( Expression )
// Factor : number

double expression(ParseInfo *info);
double expressionA(ParseInfo *info);
double term(ParseInfo *info);
double termM(ParseInfo *info);
double factor(ParseInfo *info);

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

int expect(ParseInfo *info, Token token) {
    TokenInfo currToken = lookAhead(info, 0);
    return currToken.token == token;
}

void consume(ParseInfo *info, Token token) {
    if (!expect(info, token)) {
        error(info);
        return;
    }
    next(info);
}

double expression(ParseInfo *info) {
    double a = term(info);
    if (info->didFail) return 0;

    return a + expressionA(info);
}

double expressionA(ParseInfo *info) {
    if (!expect(info, T_PLUS)) return 0;

    consume(info, T_PLUS);
    if (info->didFail) return 0;

    double a = term(info);
    if (info->didFail) return 0;

    return a + expressionA(info);
}

double term(ParseInfo *info) {
    double a = factor(info);
    if (info->didFail) return 0;

    return a * termM(info);
}

double termM(ParseInfo *info) {
    if (!expect(info, T_MULT)) return 1;

    consume(info, T_MULT);
    if (info->didFail) return 0;
    double a = factor(info);
    if (info->didFail) return 0;

    return a * termM(info);
}

double factor(ParseInfo *info) {
    if (expect(info, T_OPEN_PAREN)) {
        consume(info, T_OPEN_PAREN);
        double a = expression(info);
        consume(info, T_CLOSE_PAREN);
        return a;
    }

    if (expect(info, T_NUMBER)) {
        TokenInfo currToken = lookAhead(info, 0);
        double a = ctod(info->raw, currToken.startIndex, currToken.endIndex);
        consume(info, T_NUMBER);
        return a;
    }

    if (expect(info, T_NEG)) {
        consume(info, T_NEG);
        if (expect(info, T_OPEN_PAREN)) {
            consume(info, T_OPEN_PAREN);
            double a = expression(info);
            consume(info, T_CLOSE_PAREN);
            return a * -1;
        } else {
            TokenInfo currToken = lookAhead(info, 0);
            double a = ctod(info->raw, currToken.startIndex, currToken.endIndex);
            consume(info, T_NUMBER);
            return -1 * a;
        }
    }

    info->didFail = 1;
    return 0;
}

void interpret(TokenizeResult tokens, char* input) {
    ParseInfo *info = mmalloc(sizeof(ParseInfo));
    info->tokenIndex = 0;
    info->didFail = 0;
    info->result = 0.0;
    info->tokenizeResult = &tokens;
    info->raw = input;

    double result = expression(info);
    int cantParse = info->didFail || !info->reachedEnd;
    if (cantParse) {
        prints("no");
    } else {
        printd(result);
    }
}