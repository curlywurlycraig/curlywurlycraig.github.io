int strlen(char* input) {
    int result = 0;
    char curr;
    while ((curr = input[result]) != 0) result++;
    return result;
}