extern void prints(char* str);
extern void printf(float f);
extern void printd(double d);
extern void draw(double* results);
extern double sin(double x);
extern double cos(double x);
extern double tan(double x);

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

void executeFormula(unsigned int formulaSize, double startX, double endX, unsigned int width) {
    markmem();
    TokenizeResult tokens = tokenize(formulaInput);
    double* results = mmalloc(sizeof(double) * width);
    interpret(results, tokens, formulaInput, startX, endX, width);

    // Draw the results
    draw(results);

    resetmem();
}