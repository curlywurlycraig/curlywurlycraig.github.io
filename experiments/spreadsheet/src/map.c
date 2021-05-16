// TODO Complete this.
// The map of symbols will be good for the environment later on.
// But cell references are unique, and it makes more sense
// to use a 2D sparse array for those.

typedef struct SymbolList {
    Symbol* symbol;
    SymbolList* next;
}

Symbol sl_find(SymbolList* sl, char* name) {
    SymbolList* curr = sl;
    while (curr != NULL) {
        if (streq(curr->symbol->name, name)) {
            return *curr->symbol;
        }

        curr = curr->next;
    }

    return NULL;
}

void sl_insert(SymbolList* sl, Symbol new) {
    SymbolList* curr = sl;
    while (curr->next != NULL) {
        curr = curr->next;
    }
    SymbolList newList = {
        symbol = // TODO Continue from here.
    }
}

enum SymbolType {
    IDENT
}

typedef struct Symbol {
    char* name;
    SymbolType type;
    union value {

    }
}

// A very simple map from string to Symbol
typedef struct SymbolMap {
    SymbolList contents[];
} SymbolMap;

void sm_insert(Symbol symbol) {

}

// Hash function is simply addition of all of the ascii code points,
// modulo some number.
static unsigned int MAP_BINS = 256;
