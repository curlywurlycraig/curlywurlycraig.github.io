extern void prints(char* str);
extern void printf(float f);
extern void printd(double d);

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

double executeFormula(unsigned int formulaSize) {
    markmem();

    TokenizeResult tokens = tokenize(formulaInput);
    double result = interpret(tokens, formulaInput);

    resetmem();

    return result;
}