extern void prints(char* str);
extern void printf(float f);

#include "mem.c"
#include "string.c"
#include "math.c"
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
    TokenizeResult result = tokenize(formulaInput);
    interpret(result, formulaInput);
}