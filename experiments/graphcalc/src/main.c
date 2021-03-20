extern void prints(char* str);
extern void printf(float f);
extern void printd(double d);
extern void draw(double* results);

#include "mem.c"
#include "string.c"
#include "math.c"
#include "parse.c"

#define MAX_FORMULA_CHARS 200
#define WIDTH 800

char* formulaInput;

void init() {
    formulaInput = mmalloc(sizeof(char) * MAX_FORMULA_CHARS);
    initTokenFinders();
}

char* getInputPointer() {
    return formulaInput;
}

void executeFormula(unsigned int formulaSize) {
    markmem();
    TokenizeResult tokens = tokenize(formulaInput);
    double* results = mmalloc(sizeof(double) * WIDTH);
    interpret(tokens, formulaInput, results, WIDTH);

    // Draw the results
    draw(results);

    resetmem();
}