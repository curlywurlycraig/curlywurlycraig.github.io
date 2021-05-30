#ifndef __INTERPRET_H__
#define __INTERPRET_H__

#include "parse.h"

// Environment

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

#define MAX_BINDINGS 20

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

// Interpretation

typedef struct ValueList {
    Value** values;
    int length;
} ValueList;

typedef struct ValueFunc {
    List* body;
    Ident* bindings;
    int argc;
} ValueFunc;

Value* funcEval(ValueFunc* vf, Value** bindingValues);

Value* valueNewDouble(double val);

double valueGetNum(Value* value);

struct BuiltinFunction {
    evalFunc func;
    char* name;
};

Value* _add(Value** args, unsigned int argc);

Value* _sub(Value** args, unsigned int argc);

Value* _mult(Value** args, unsigned int argc);

Value* _sin(Value **args, unsigned int argc);

Value* _cos(Value** args, unsigned int argc);

Value* _tan(Value** args, unsigned int argc);

Value* _range(Value** args, unsigned int argc);

Value* _map(Value** args, unsigned int argc);

// Macros (just don't eval their args)

Value* _f(Elem** args, unsigned int argc);

Value* listEval(List* list);

Value* cellRangeEval(Elem* cellRange);

Value* elemEval(Elem* input);

Value* executeFromIdent(Ident firstIdent, Elem** args, unsigned int argc);

// Evaluate lisp and set the result to the given cell
void evalAndSetResultToCell(TokenizeResult tokens, char* input, int row, int col);

void evalAndSetResultsToCol(TokenizeResult tokens, char* input, int col);

#endif