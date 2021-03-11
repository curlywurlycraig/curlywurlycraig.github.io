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
    // TODO Parse the formula and execute it
    if (validateNumber(formulaInput) == VALID) {
        prints("It is a number!");
    } else if (validateNumber(formulaInput) == INVALID) {
        prints("It is not a number :(");
    }
}