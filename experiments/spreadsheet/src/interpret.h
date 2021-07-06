#ifndef __INTERPRET_H__
#define __INTERPRET_H__

#include "parse.h"

#define BUILTIN_COUNT 9
#define MAX_BINDINGS 20
#define ROW_COUNT 20
#define COL_COUNT 20

typedef struct ValueList ValueList;
typedef struct ValueFunc ValueFunc;

enum ValueType {
    V_LIST,
    V_NUM,
    V_STR,
    V_FUNC
};

typedef struct Value {
    enum ValueType type;
    union {
        double num;
        char* str;
        ValueList* list;
        ValueFunc* func;
    } val;
} Value;

typedef Value* (*evalFunc)(Value**, unsigned int);

enum CellValueType {
    CELL_UNSET,
    CELL_NUM,
    CELL_STR
};

typedef struct CellValue {
    enum CellValueType type;
    union {
        double num;
        char* str;
    } val;
} CellValue;

typedef struct Binding {
    char* name;
    Value* val;
} Binding;

typedef struct Env {
    CellValue** cellValues;
    Binding* bindings;
    int bindingCount;
} Env;

typedef struct ValueList {
    Value** values;
    int length;
} ValueList;

enum ValueFuncType {
    VF_BUILTIN,
    VF_LISP
};

typedef struct BuiltinFunction {
    evalFunc func;
    char* name;
} BuiltinFunction;

typedef struct LispFunction {
    List* body;
    Ident* bindings;
    int argc;
} LispFunction;

typedef struct ValueFunc {
    enum ValueFuncType type;
    union {
        LispFunction lispF;
        BuiltinFunction builtin;
    } value;
} ValueFunc;

static BuiltinFunction builtinFunctions[BUILTIN_COUNT];

void initEnv();

Value* envLookupBinding(char* name);

void envSetBinding(char* name, Value* value);

CellValue cellValueDouble(double value);

void envSetDoubleCell(int row, int col, double value);

void envSetCellByName(char* cellName, double value);

CellValue* envGetCell(int row, int col);

CellValue* envGetCellByName(char* cellName);

int envIsCellNameList(char* cellName);

int envGetColumnByName(char* cellName);

Value* funcEval(ValueFunc* vf, Value** bindingValues, int argc);

Value* valueNewDouble(double val);

double valueGetNum(Value* value);

Value* listEval(List* list);

Value* cellRangeEval(Elem* cellRange);

Value* elemEval(Elem* input);

Value* executeFromIdent(Ident firstIdent, Elem** args, unsigned int argc);

// Evaluate lisp and set the result to the given cell
void evalAndSetResultToCell(TokenizeResult tokens, char* input, int row, int col);

void evalAndSetResultsToCol(TokenizeResult tokens, char* input, int col);

#endif