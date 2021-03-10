int strlen(char* input) {
    int result = 0;
    while ((char curr = input[result]) != 0) result++;
    return result;
}