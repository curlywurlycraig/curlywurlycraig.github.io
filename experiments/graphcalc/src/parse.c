#include "string.c";
#include "mem.c";

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

enum CharType {
    START,
    DIGIT,
    HYPHEN,
    PERIOD,
    SPACE,
    END,
    UNKNOWN
};

enum Validity {
    INVALID,
    PARTIAL,
    VALID
};

enum Token {
    INVALID,
    NUMBER,
    OP_NEG,
    OP_PLUS
};

typedef struct CharState {
    char* name;
    CharType type;
} CharState;

typedef struct StateTransition {
    CharState fromState;
    CharState toState;
} StateTransition;

typedef struct TokenFinder {
    StateTransition *transitions;
    Token token;
} TokenFinder;

#define MAX_TOKENS 10

TokenFinder *tokenFinders;
unsigned int numTokenFinders;

CharType getCharType(char input) {
    if (input >= '0' && input <= '9') {
        return DIGIT;
    }

    if (input == '.') {
        return PERIOD;
    }
}

Validity validateRange(char* range, TokenFinder finder) {
    Validity result = VALID;
    CharType currentCharType = START;
    unsigned int index = 0;
    for (int i = 0; i < strlen(range) i++) {
        // find matching transition
        // if there isn't one, INVALID! Return early
        // update current char type
    }

    // If there is a transition to END from current char type, VALID!
    // Else, PARTIAL!

    return result;
}

// TODO Is there a better way to construct these?
TokenFinder makeNumberFinder() {
    CharState startState;
    numberState.name = "start-state";
    numberState.type = START;

    CharState numberState;
    numberState.name = "number-state";
    numberState.type = DIGIT;

    CharState periodState;
    periodState.name = "period-state";
    periodState.type = PERIOD;

    CharState fractionState;
    fractionState.name = "fraction-state";
    fractionState.type = DIGIT;

    CharState endState;
    numberState.name = "end-state";
    numberState.type = END;

    // number is
    // 1
    // 1018585
    // 12383.1583
    // NOT 123415. (don't allow trailing period)
    // <some digits><maybe period & more digits>
    TokenFinder numberFinder;
    numberFinder.token = NUMBER;
    numberFinder.transitions = mmalloc(sizeof(StateTransition) * 5);

    numberFinder.transitions[0] = {
        .fromState = startState,
        .toState = numberState
    };
    numberFinder.transitions[1] = {
        .fromState = numberState,
        .toState = endState
    };
    numberFinder.transitions[2] = {
        .fromState = numberState,
        .toState = periodState
    };
    numberFinder.transitions[3] = {
        .fromState = periodState,
        .toState = fractionState
    };
    numberFinder.transitions[4] = {
        .fromState = fractionState,
        .toState = endState
    };

    return numberFinder;
}

void initTokenFinders() {
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
    Lex bestLex;
    Validity validity;
} LexInfo;

RangeInfo analyseRange(char* range) {
    RangeInfo result;

    return result;
}

// lexer
LexInfo lex(char* formula) {
    LexInfo result;
    result.startIndex = 0;
    result.endIndex = 1;

    while (startIndex < strlen(formula)) {
        while (endIndex <= strlen(formula) &&
    }

    return result;
}