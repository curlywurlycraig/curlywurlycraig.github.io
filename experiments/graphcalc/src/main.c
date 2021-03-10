extern void prints(char* str);
extern void printf(float f);

#include "mem.c"

#define MAX_FORMULA_CHARS 200

char* formulaInput;

void init() {
    formulaInput = mmalloc(sizeof(char) * MAX_FORMULA_CHARS);
}

char* getInputPointer() {
    return formulaInput;
}

void executeFormula(unsigned int formulaSize) {
    prints(formulaInput);
    // TODO Parse the formula and execute it
}