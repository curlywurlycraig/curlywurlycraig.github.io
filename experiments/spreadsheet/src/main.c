extern void prints(char* str);
extern void printf(float f);
extern void printd(double d);
extern double sin(double x);
extern double cos(double x);
extern double tan(double x);

#include "mem.c"
#include "string.c"
#include "math.c"
#include "parse.c"

#define MAX_FORMULA_CHARS 200
#define COL_COUNT 20
#define ROW_COUNT 20

char* formulaInput;
double** computedCells;

void init() {
    formulaInput = mmalloc(sizeof(char) * MAX_FORMULA_CHARS);
    computedCells = mmalloc(sizeof(double*) * ROW_COUNT);
    for (int i = 0; i < ROW_COUNT; i++) {
        computedCells[i] = mmalloc(sizeof(double) * COL_COUNT);
    }

    initTokenFinders();
    initEnv();
}

char* getInputPointer() {
    return formulaInput;
}

void executeFormula(unsigned int formulaSize) {
    markmem();

    TokenizeResult tokens = tokenize(formulaInput);
    interpret(tokens, formulaInput);

    resetmem();
}