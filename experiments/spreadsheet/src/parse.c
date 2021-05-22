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
    COLON,
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
    T_DIV,
    T_CELLREF
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

    TokenFinder cellrefFinder;
    cellrefFinder.token = T_CELLREF;
    cellrefFinder.transitionCount = 4;
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

// Parse

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

enum IdentType {
    I_FUNC,
    I_NUM,
    I_STR,
    I_CELLRANGE
};

typedef struct Ident {
    enum IdentType type;
    int didFail;
    union {
        char* name;
        double num;
    } val;
} Ident;

enum ElemType {
    E_LIST,
    E_IDENT
};

typedef struct List List;
struct List;

typedef struct Elem {
    enum ElemType type;
    int didFail;
    union {
        List* list;
        Ident ident;
    } val;
} Elem;

typedef struct List {
    int didFail;
    Elem** elems;
    int elemCount;
} List;

List* list(ParseInfo *info);
Elem* elem(ParseInfo *info);

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
            .type = I_FUNC,
            .val = { .name = currToken.raw }
        };
        return result;
    }


    return 0;
}

// Environment

static unsigned int ROW_COUNT = 20;
static unsigned int COL_COUNT = 20;

typedef struct Env {
    double** cellValues;
} Env;

Env env;

void initEnv() {
    env.cellValues = mmalloc(sizeof(double*) * ROW_COUNT);
    for (int i = 0; i < ROW_COUNT; i++) {
        double* row = mmalloc(sizeof(double) * COL_COUNT);
        env.cellValues[i] = row;

        for (int j = 0; j < COL_COUNT; j++) {
            row[j] = 0;
        }
    }
}

void envSetCell(int row, int col, double value) {
    env.cellValues[row][col] = value;
}

void envSetCellByName(char* cellName, double value) {
    // TODO This will need to be a bit more elaborate to support more than 10/9 rows.
    int col = cellName[1] - 'A';
    int row = cellName[2] - '0';

    env.cellValues[row][col] = value;
}

double envGetCellByName(char* cellName) {
    // TODO This will need to be a bit more elaborate to support more than 10/9 rows.
    int col = cellName[1] - 'A';
    int row = cellName[2] - '0';

    double result = env.cellValues[row][col];
    return result;
}

double envGetCell(int row, int col) {
    return env.cellValues[row][col];
}

// Interpretation

typedef Elem* (*evalFunc)(Elem**, unsigned int);

Elem* executeFunctionIdent(Ident firstIdent, Elem** args, unsigned int argc);

Elem* listEval(List* list);
Elem* elemEval(Elem* elem);

Elem* elemNewDouble(double val) {
    Elem* result = mmalloc(sizeof(Elem));
    result->type = E_IDENT;
    result->didFail = 0; // Hmm. This shouldn't be here actually.
    result->val.ident = (Ident) {
        .type = I_NUM,
        .didFail = 0,
        .val.num = val
    };
    return result;
}

double elemEvalNumber(Elem* elem) {
    return elem->val.ident.val.num;
}

struct FunctionIdent {
    evalFunc func;
    char* name;
};

Elem* _add(Elem** args, unsigned int argc) {
    double result = 0;
    for (int i = 0; i < argc; i++) {
        result += elemEvalNumber(args[i]);
    }
    return elemNewDouble(result);
}

Elem* _sub(Elem** args, unsigned int argc) {
    double result = elemEvalNumber(args[0]);
    for (int i = 1; i < argc; i++) {
        result -= elemEvalNumber(args[i]);
    }
    return elemNewDouble(result);
}

Elem* _mult(Elem** args, unsigned int argc) {
    double result = elemEvalNumber(args[0]);
    for (int i = 1; i < argc; i++) {
        result = result * elemEvalNumber(args[i]);
    }
    return elemNewDouble(result);
}

Elem* _sin(Elem **args, unsigned int argc) {
    return elemNewDouble(sin(elemEvalNumber(args[0])));
}

Elem* _cos(Elem** args, unsigned int argc) {
    return elemNewDouble(cos(elemEvalNumber(args[0])));
}

Elem* _tan(Elem** args, unsigned int argc) {
    return elemNewDouble(tan(elemEvalNumber(args[0])));
}

Elem* _range(Elem** args, unsigned int argc) {
    int start = elemEvalNumber(args[0]);
    int end = elemEvalNumber(args[1]);

    List* resultList = mmalloc(sizeof(List));
    resultList->didFail = 0;
    resultList->elemCount = end - start;
    resultList->elems = mmalloc(sizeof(Elem*) * resultList->elemCount);

    for (int i = 0; i < end - start; i++) {
        Elem* newElem = elemNewDouble(start + i);
        resultList->elems[i] = newElem;
    }

    Elem* result = mmalloc(sizeof(Elem));
    result->type = E_LIST;
    result->didFail = 0;
    result->val.list = resultList;
    return result;
}

static int builtinCount = 7;
static struct FunctionIdent builtinFunctionIdents[] = {
    {
        .func = &_add,
        .name = "+"
    },
    {
        .func = &_sub,
        .name = "-"
    },
    {
        .func = &_mult,
        .name = "*"
    },
    {
        .func = &_sin,
        .name = "sin"
    },
    {
        .func = &_cos,
        .name = "cos"
    },
    {
        .func = &_tan,
        .name = "tan"
    },
    {
        .func = &_range,
        .name = "range"
    }
};

Elem* listEval(List* list) {
    Ident firstIdent = list->elems[0]->val.ident;
    Elem** rest = list->elems + 1;
    return executeFunctionIdent(firstIdent, rest, list->elemCount - 1);
}

Elem* elemEval(Elem* input) {
    if (input->type == E_LIST) {
        return listEval(input->val.list);
    } else if (input->type == E_IDENT && input->val.ident.type == I_CELLRANGE) {
        return elemNewDouble(envGetCellByName(input->val.ident.val.name));
    } else {
        return input;
    }
}

Elem* executeFunctionIdent(Ident firstIdent, Elem** args, unsigned int argc) {
    char* name = firstIdent.val.name;

    // TODO Execute macros that don't necessarily eval
    // recursively (e.g. `if`)

    for (int i = 0; i < builtinCount; i++) {
        if (streq(name, builtinFunctionIdents[i].name)) {
            // Recursively eval args
            Elem** primitiveArgs = mmalloc(sizeof(Elem) * argc);
            for (int i = 0; i < argc; i++) {
                primitiveArgs[i] = elemEval(args[i]);
            }

            return builtinFunctionIdents[i].func(primitiveArgs, argc);
        }
    }

    // TODO Look for the function in the env

    // Error case (null pointer)
    return 0;
}

// Evaluate lisp and set the result to the given cell
void evalAndSetResultToCell(TokenizeResult tokens, char* input, int row, int col) {
    ParseInfo *info = mmalloc(sizeof(ParseInfo));

    info->tokenIndex = 0;
    info->didFail = 0;
    info->result = 0.0;
    info->tokenizeResult = &tokens;
    info->raw = input;

    // TODO Error handling when result is not a type
    // with a num. Also handle string types
    Elem* result = listEval(list(info));
    envSetCell(row, col, result->val.ident.val.num);
}

void evalAndSetResultsToCol(TokenizeResult tokens, char* input, int col) {
    ParseInfo *info = mmalloc(sizeof(ParseInfo));

    info->tokenIndex = 0;
    info->didFail = 0;
    info->result = 0.0;
    info->tokenizeResult = &tokens;
    info->raw = input;

    Elem* result = listEval(list(info));
    List* resultList = result->val.list;
    for (int i = 0; i < resultList->elemCount; i++) {
        envSetCell(i, col, resultList->elems[i]->val.ident.val.num);
    }
}