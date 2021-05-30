#include "mem.h"
#include "string.h"
#include "imports.h"
#include "interpret.h"

// Environment

static unsigned int ROW_COUNT = 20;
static unsigned int COL_COUNT = 20;

Env env;

void initEnv() {
    // TODO Don't hard code bindings
    env.bindingCount = 0;
    env.bindings = mmalloc(sizeof(Binding) * MAX_BINDINGS);
    env.cellValues = mmalloc(sizeof(CellValue*) * ROW_COUNT);
    for (int i = 0; i < ROW_COUNT; i++) {
        CellValue* row = mmalloc(sizeof(CellValue) * COL_COUNT);
        env.cellValues[i] = row;

        for (int j = 0; j < COL_COUNT; j++) {
            row[j] = (CellValue) {
                .type = CELL_UNSET
            };
        }
    }
}

Value* envLookupBinding(char* name) {
    // First look through builtins, which are a kind of
    // "system binding"
    for (int i = 0; i < BUILTIN_COUNT; i++) {
        if (streq(name, builtinFunctions[i].name)) {
            // TODO Create all of these Values up front
            // and store them in a "builtins" in the env.
            // Also is this really a "binding"?
            // I've sometimes called it "identifier", or
            // "var"/"variable".
            ValueFunc* vf = mmalloc(sizeof(ValueFunc));
            vf->type = VF_BUILTIN;
            vf->value.builtin = builtinFunctions[i];

            Value* result = mmalloc(sizeof(Value));
            result->type = V_FUNC;
            result->val.func = vf;

            return result;
        }
    }

    // Reverse lookup so most recent are found first.
    // This means inner bound vars shadow outer ones.
    // More like a stack that way!
    for (int i = env.bindingCount - 1; i >= 0; i--) {
        if (streq(name, env.bindings[i].name)) {
            return env.bindings[i].val;
        }
    }

    return 0;
}

void envSetBinding(char* name, Value* value) {
    Binding newBinding = (Binding) {
        .name = name,
        .val = value
    };
    env.bindings[env.bindingCount] = newBinding;
    env.bindingCount++;
}

CellValue cellValueDouble(double value) {
    return (CellValue) {
        .type = CELL_NUM,
        .val = {
            .num = value
        }
    };
}

void envSetDoubleCell(int row, int col, double value) {
    env.cellValues[row][col] = cellValueDouble(value);
}

void envSetCellByName(char* cellName, double value) {
    // TODO This will need to be a bit more elaborate to support more than 10/9 rows.
    int col = cellName[1] - 'A';
    int row = cellName[2] - '0';

    env.cellValues[row][col] = cellValueDouble(value);
}

CellValue* envGetCell(int row, int col) {
    return &env.cellValues[row][col];
}

CellValue* envGetCellByName(char* cellName) {
    // TODO This will need to be a bit more elaborate to support more than 10/9 rows.
    int col = cellName[1] - 'A';
    int row = cellName[2] - '0';

    return envGetCell(row, col);
}

// TODO Handle :C3-C5. Would be true in this case
int envIsCellNameList(char* cellName) {
    return cellName[2] == '\0';
}

int envGetColumnByName(char* cellName) {
    return cellName[1] - 'A';
}

// Interpretation

Value* valueNewDouble(double val) {
    Value* result = mmalloc(sizeof(Value));
    result->type = V_NUM;
    result->val.num = val;
    return result;
}

double valueGetNum(Value* value) {
    return value->val.num;
}

Value* _add(Value** args, unsigned int argc) {
    double result = 0;
    for (int i = 0; i < argc; i++) {
        result += valueGetNum(args[i]);
    }
    return valueNewDouble(result);
}

Value* _sub(Value** args, unsigned int argc) {
    double result = valueGetNum(args[0]);
    for (int i = 1; i < argc; i++) {
        result -= valueGetNum(args[i]);
    }
    return valueNewDouble(result);
}

Value* _mult(Value** args, unsigned int argc) {
    prints("mult");
    printi(argc);
    double result = valueGetNum(args[0]);
    printd(result);
    printd(valueGetNum(args[1]));
    for (int i = 1; i < argc; i++) {
        result = result * valueGetNum(args[i]);
    }

    printd(result);
    return valueNewDouble(result);
}

Value* _sin(Value **args, unsigned int argc) {
    return valueNewDouble(sin(valueGetNum(args[0])));
}

Value* _cos(Value** args, unsigned int argc) {
    return valueNewDouble(cos(valueGetNum(args[0])));
}

Value* _tan(Value** args, unsigned int argc) {
    return valueNewDouble(tan(valueGetNum(args[0])));
}

Value* _range(Value** args, unsigned int argc) {
    double start = valueGetNum(args[0]);
    double end = valueGetNum(args[1]);
    double step = argc > 2 ? valueGetNum(args[2]) : 1.0;

    ValueList* resultList = mmalloc(sizeof(ValueList));
    int numValues = (end - start) / step;
    resultList->values = mmalloc(sizeof(Value*) * numValues);

    double value = start;
    int index = 0;
    while (value < end) {
        Value* newValue = valueNewDouble(value);
        resultList->values[index] = newValue;
        index++;
        value += step;
    }
    resultList->length = numValues;

    Value* result = mmalloc(sizeof(Value));
    result->type = V_LIST;
    result->val.list = resultList;
    return result;
}

Value* _map(Value** args, unsigned int argc) {
    Value* func = args[0];
    Value* list = args[1];

    ValueList* resultList = mmalloc(sizeof(ValueList));
    int numValues = list->val.list->length;
    resultList->values = mmalloc(sizeof(Value*) * numValues);

    for (int i = 0; i < numValues; i++) {
        Value** bindings = mmalloc(sizeof(Value*));
        bindings[0] = list->val.list->values[i];
        Value* newValue = funcEval(func->val.func, bindings, argc);
        resultList->values[i] = newValue;
    }

    resultList->length = numValues;

    Value* result = mmalloc(sizeof(Value));
    result->type = V_LIST;
    result->val.list = resultList;
    return result;
}

Value* _reduce(Value** args, unsigned int argc) {
    Value* func = args[0];
    Value* list = args[1];
    Value* result = args[2];

    int numValues = list->val.list->length;

    for (int i = 0; i < numValues; i++) {
        Value** bindings = mmalloc(sizeof(Value*) * 2);
        bindings[0] = valueNewDouble(valueGetNum(result));
        bindings[1] = list->val.list->values[i];

        result = funcEval(func->val.func, bindings, 2);
    }

    return result;
}

// Macros (just don't eval their args)

Value* _f(Elem** args, unsigned int argc) {
    List* bindingArgs = args[0]->val.list;
    Ident* bindings = mmalloc(sizeof(Ident) * bindingArgs->elemCount);

    for (int i = 0; i < bindingArgs->elemCount; i++) {
        bindings[i] = bindingArgs->elems[i]->val.ident;
    }

    ValueFunc* vf = mmalloc(sizeof(ValueFunc));
    vf->type = VF_LISP;

    LispFunction lf;
    lf.body = args[1]->val.list;
    lf.bindings = bindings;
    lf.argc = bindingArgs->elemCount;

    vf->value.lispF = lf;

    Value* result = mmalloc(sizeof(Value));
    result->type = V_FUNC;
    result->val.func = vf;

    return result;
}

// Builtins (their args are eval'd recursively)

// NOTE Remember to update BUILTIN_COUNT in interpret.h when
// adding new items.
// TODO Init these in the env and combine variable lookup
// with other env things.
static BuiltinFunction builtinFunctions[] = {
    {
        .func = &_add,
        .name = "+"
    },
    {
        .func = &_sub,
        .name = "-"
    },
    {
        .func = &_mult,
        .name = "*"
    },
    {
        .func = &_sin,
        .name = "sin"
    },
    {
        .func = &_cos,
        .name = "cos"
    },
    {
        .func = &_tan,
        .name = "tan"
    },
    {
        .func = &_range,
        .name = "range"
    },
    {
        .func = &_reduce,
        .name = "reduce"
    },
    {
        .func = &_map,
        .name = "map"
    }
};

Value* funcEval(ValueFunc* vf, Value** bindingValues, int argc) {
    if (vf->type == VF_BUILTIN) {
        return vf->value.builtin.func(bindingValues, argc);
    }

    for (int i = 0; i < argc; i++) {
        envSetBinding(
            vf->value.lispF.bindings[i].val.name,
            bindingValues[i]
        );
    }

    Value* result = listEval(vf->value.lispF.body);

    // Sort of like a faux stack. Just "pop" off entries by
    // decrementing the stack pointer.
    for (int i = 0; i < argc; i++) {
        env.bindingCount--;
    }

    return result;
}

Value* cellRangeEval(Elem* cellRange) {
    char* cellName = cellRange->val.ident.val.name;
    if (envIsCellNameList(cellName)) {
        ValueList* resultList = mmalloc(sizeof(ValueList));
        resultList->length = 0;
        // TODO Don't hard code max len of value list
        resultList->values = mmalloc(sizeof(Value*) * 256);

        Value* result = mmalloc(sizeof(Value));
        result->type = V_LIST;

        int col = envGetColumnByName(cellName);
        int row = 0;

        CellValue* curr = envGetCell(row, col);
        while (curr->type != CELL_UNSET) {
            Value* newCell = mmalloc(sizeof(Value));
            newCell->type = V_NUM;
            newCell->val.num = curr->val.num;
            resultList->values[row] = newCell;
            resultList->length++;
            row++;
            curr = envGetCell(row, col);
        }

        result->val.list = resultList;
        return result;
    } else {
        return valueNewDouble(envGetCellByName(cellName)->val.num);
    }
}

Value* listEval(List* list) {
    Elem** args = list->elems + 1;
    int elemc = list->elemCount;
    int argc = list->elemCount - 1;

    Ident firstIdent = list->elems[0]->val.ident;
    char* name = firstIdent.val.name;

    // Special forms (functions that don't necessarily eval their args)
    if (streq(name, "f")) {
        return _f(args, argc);
    }

    // Eval args recursively
    Value** evalledArgs = mmalloc(sizeof(Value*) * elemc);
    for (int i = 0; i < argc + 1; i++) {
        evalledArgs[i] = elemEval(list->elems[i]);
    }

    return funcEval(evalledArgs[0]->val.func, evalledArgs + 1, argc);

    // Error case (null pointer)
    return 0;
}

Value* elemEval(Elem* input) {
    if (input->type == E_LIST) {
        return listEval(input->val.list);
    } else if (input->type == E_IDENT && input->val.ident.type == I_CELLRANGE) {
        return cellRangeEval(input);
    } else if (input->type == E_IDENT && input->val.ident.type == I_NUM) {
        return valueNewDouble(input->val.ident.val.num);
    } else if (input->type == E_IDENT && input->val.ident.type == I_VAR) {
        return envLookupBinding(input->val.ident.val.name);
    } else {
        return 0;
    }
}

// Evaluate lisp and set the result to the given cell
void evalAndSetResultToCell(TokenizeResult tokens, char* input, int row, int col) {
    ParseInfo *info = mmalloc(sizeof(ParseInfo));

    info->tokenIndex = 0;
    info->didFail = 0;
    info->result = 0.0;
    info->tokenizeResult = &tokens;
    info->raw = input;

    // TODO Error handling when result is not a type
    // with a num. Also handle string types
    Value* result = listEval(list(info));
    envSetDoubleCell(row, col, result->val.num);
}

void evalAndSetResultsToCol(TokenizeResult tokens, char* input, int col) {
    ParseInfo *info = mmalloc(sizeof(ParseInfo));

    info->tokenIndex = 0;
    info->didFail = 0;
    info->result = 0.0;
    info->tokenizeResult = &tokens;
    info->raw = input;

    Value* result = listEval(list(info));
    ValueList* resultList = result->val.list;
    for (int i = 0; i < resultList->length; i++) {
        envSetDoubleCell(i, col, resultList->values[i]->val.num);
    }
}