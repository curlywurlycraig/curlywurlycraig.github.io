#include "mem.h"
#include "string.h"
#include "math.h"
#include "parse.h"
#include "interpret.h"
#include "imports.h"

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

void executeFormulaForCell(int row, int col) {
    markmem();

    TokenizeResult tokens = tokenize(formulaInput);
    evalAndSetResultToCell(tokens, formulaInput, row, col);

    resetmem();
}

void executeFormulaForCol(int col) {
    markmem();

    TokenizeResult tokens = tokenize(formulaInput);
    evalAndSetResultsToCol(tokens, formulaInput, col);

    resetmem();
}