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
    SLASH,
    END,
    LETTER,
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
    T_WHITESPACE,
    T_IDENT,
    T_DIV
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

    if ((input >= 'a' && input <= 'z') || (input >= 'A' && input <= 'Z')) {
        return LETTER;
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

    if (input == '/') {
        return SLASH;
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
    return makeRepeatingCharacterFinder(LETTER, T_IDENT);
}

TokenFinder makeAsteriskFinder() {
    return makeSingleCharacterFinder(ASTERISK, T_MULT);
}

TokenFinder makeOpenParenFinder() {
    return makeSingleCharacterFinder(OPEN_PAREN, T_OPEN_PAREN);
}

TokenFinder makeCloseParenFinder() {
    return makeSingleCharacterFinder(CLOSE_PAREN, T_CLOSE_PAREN);
}

TokenFinder makePlusFinder() {
    return makeSingleCharacterFinder(PLUS, T_PLUS);
}

TokenFinder makeMinusFinder() {
    return makeSingleCharacterFinder(HYPHEN, T_NEG);
}

TokenFinder makeWhitespaceFinder() {
    return makeRepeatingCharacterFinder(SPACE, T_WHITESPACE);
}

TokenFinder makeDivisionFinder() {
    return makeSingleCharacterFinder(SLASH, T_DIV);
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
    tokenFinders[7] = makeIdentifierFinder();
    numTokenFinders++;
    tokenFinders[8] = makeDivisionFinder();
    numTokenFinders++;
}

typedef struct TokenInfo {
    Validity validity;
    Token token;
    char* raw;
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
                newToken.raw = mmalloc(sizeof(char) * 256);
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
            newToken.raw = mmalloc(sizeof(char) * 256);
            strcpy(newToken.raw, formula, newToken.startIndex, newToken.endIndex);
            result.tokens[result.tokenCount] = newToken;
            result.tokenCount++;
        }
    }

    return result;
}

// Interpreter

typedef double (*doubleFunc)(double);

struct FunctionIdent {
    doubleFunc func;
    char* name;
};

static int functionIdentCount = 3;
static struct FunctionIdent functionIdents[] = {
    {
        .func = &sin,
        .name = "sin"
    },
    {
        .func = &cos,
        .name = "cos"
    },
    {
        .func = &tan,
        .name = "tan"
    }
};

double executeFunctionIdent(char* identName, double input) {
    for (int i = 0; i < functionIdentCount; i++) {
        if (streq(identName, functionIdents[i].name)) {
            return functionIdents[i].func(input);
        }
    }

    // Error case
    return 0.0;
}

typedef struct ParseInfo {
    int tokenIndex;
    int didFail;
    int reachedEnd;
    double result;
    TokenizeResult *tokenizeResult;
    char* raw;

    double x;
    double t;
} ParseInfo;

TokenInfo lookAhead(ParseInfo *info, int ahead) {
    return info->tokenizeResult->tokens[info->tokenIndex + ahead];
}

// left recursive grammar
// ----
// expression : expression + expression
// expression : expression * expression
// expression : expression / expression
// expression : number
// expression : ( expression )

// with left recursion removed
// ----
// Expression : Term ExpressionA

// ExpressionA : + Term ExpressionA
// ExpressionA : - Term ExpressionA
// ExpressionA : <nothing>

// Term : Factor TermM
// TermM : * Factor TermM
// TermM : / Factor TermM
// TermM : <nothing>

// Factor : ( Expression )
// Factor : -number
// Factor : -( Expression )
// Factor : number
// Factor : Function
// Factor : identifier

// Function : identifier(Expression)

double expression(ParseInfo *info);
double expressionA(ParseInfo *info);
double term(ParseInfo *info);
double termM(ParseInfo *info);
double factor(ParseInfo *info);
double function(ParseInfo *info);

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

double expression(ParseInfo *info) {
    double a = term(info);
    if (info->didFail) return 0;

    return a + expressionA(info);
}

double expressionA(ParseInfo *info) {
    if (expect(info, T_PLUS)) {
        consume(info, T_PLUS);
        if (info->didFail) return 0;

        double a = term(info);
        if (info->didFail) return 0;

        return a + expressionA(info);
    } else if (expect(info, T_NEG)) {
        consume(info, T_NEG);
        if (info->didFail) return 0;

        double a = term(info);
        if (info->didFail) return 0;

        return -1 * a + expressionA(info);
    } else {
        return 0;
    }
}

double term(ParseInfo *info) {
    double a = factor(info);
    if (info->didFail) return 0;

    if (expect(info, T_MULT)) {
        return a * termM(info);
    } else if (expect(info, T_DIV)) {
        return a / termM(info);
    } else {
        return a * termM(info);
    }
}

double termM(ParseInfo *info) {
    if (expect(info, T_MULT)) {
        consume(info, T_MULT);
    } else if (expect(info, T_DIV)) {
        consume(info, T_DIV);
    } else {
        return 1.0;
    }

    if (info->didFail) return 1.0;
    double a = factor(info);
    if (info->didFail) return 1.0;

    if (expect(info, T_MULT)) {
        return a * termM(info);
    } else if (expect(info, T_DIV)) {
        return a / termM(info);
    } else {
        return a * termM(info);
    }
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
        double a = ctod(currToken.raw);
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
            double a = ctod(currToken.raw);
            consume(info, T_NUMBER);
            return -1 * a;
        }
    }

    if (expect(info, T_IDENT) && expectk(info, T_OPEN_PAREN, 2)) {
        double a = function(info);
        return a;
    }

    if (expect(info, T_IDENT)) {
        consume(info, T_IDENT);
        return info->x;
    }

    info->didFail = 1;
    return 0;
}

double function(ParseInfo *info) {
    consume(info, T_IDENT);
    if (info->didFail) return 0;
    TokenInfo identToken = last(info);

    consume(info, T_OPEN_PAREN);
    if (info->didFail) return 0;

    double result = expression(info);

    consume(info, T_CLOSE_PAREN);
    if (info->didFail) return 0;

    return executeFunctionIdent(identToken.raw, result);
}

void interpret(double* results, TokenizeResult tokens, char* input, double startX, double endX) {
    ParseInfo *info = mmalloc(sizeof(ParseInfo));

    for (int i = 0; i < 800; i++) {
        info->tokenIndex = 0;
        info->didFail = 0;
        info->result = 0.0;
        info->tokenizeResult = &tokens;
        info->raw = input;
        info->x = 0.0;
        info->t = 0.0;
        info->x = startX + i * (endX - startX) / 800.0;
        double result = expression(info);
        results[i] = result;
    }
}