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
    NUMBER,
    OP_NEG,
    OP_PLUS
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

#define MAX_TOKENS 10

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

    return UNKNOWN;
}

Validity validateRange(char* range, TokenFinder finder) {
    CharState currentCharState = startState;
    for (int i = 0; i < strlen(range); i++) {
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

Validity validateNumber(char* range) {
    return validateRange(range, tokenFinders[0]);
}

// TODO Is there a better way to construct these?
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

void initTokenFinders() {
    startState.id = -1;
    startState.type = START;

    endState.id = -2;
    endState.type = END;

    numTokenFinders = 0;
    tokenFinders = mmalloc(sizeof(TokenFinder) * MAX_TOKENS);

    tokenFinders[0] = makeNumberFinder();
    numTokenFinders++;
}

// Range + Lex

typedef struct RangeInfo {
    Validity validity;
    Token token;
} RangeInfo;

typedef struct LexInfo {
    unsigned int startIndex;
    unsigned int endIndex;

    unsigned int farthestGood;
    Token bestToken;
    Validity validity;
} LexInfo;

// RangeInfo analyseRange(char* range) {
//     RangeInfo result;

//     return result;
// }

// lexer
// LexInfo lex(char* formula) {
//     LexInfo result;
//     result.startIndex = 0;
//     result.endIndex = 1;

//     while (startIndex < strlen(formula)) {
//         while (endIndex <= strlen(formula) &&
//     }

//     return result;
// }