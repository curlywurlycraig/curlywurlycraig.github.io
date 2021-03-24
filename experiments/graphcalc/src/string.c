int strlen(char* input) {
    int result = 0;
    char curr;
    while ((curr = input[result]) != 0) result++;
    return result;
}

static int MAX_STRLEN_CMP = 128;

int streq(char* input1, char* input2) {
    for (int i = 0; i < MAX_STRLEN_CMP; i++) {
        if (input1[i] != input2[i]) return 0;
        if (input1[i] == 0) return 1;
    }

    // Can't be sure in this case
    return 1;
}

void strcpy(char* output, char* input, int start, int end) {
    for (int i = 0; i < end - start; i++) {
        output[i] = input[start+i];
    }
    output[end-start] = 0;
}