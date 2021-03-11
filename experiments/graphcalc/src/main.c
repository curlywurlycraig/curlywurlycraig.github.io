extern void prints(char* str);
extern void printf(float f);

#include "mem.c"
#include "string.c"
#include "parse.c"

#define MAX_FORMULA_CHARS 200

char* formulaInput;

void init() {
    formulaInput = mmalloc(sizeof(char) * MAX_FORMULA_CHARS);
    initTokenFinders();
}

char* getInputPointer() {
    return formulaInput;
}

void executeFormula(unsigned int formulaSize) {
    // tokenize
    // prints("\n\n");
    TokenizeResult result = tokenize(formulaInput);
    interpret(result, formulaInput);
    // for (int i = 0; i < result.tokenCount; i++) {
    //     printf(result.tokens[i].token);
    //     printf(result.tokens[i].startIndex);
    //     printf(result.tokens[i].endIndex);
    //     prints("---");
    // }
    // prints("stop");
}