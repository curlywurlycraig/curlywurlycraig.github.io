// JS imports
void prints(const char *address);
void printfl(float num);
float random();
float sin(float rads);
float cos(float rads);
float tan(float rads);
void dispatchAudioFrame(const float *samples);

#include "mem.c"

const float CANVAS_WIDTH = 800.0f;
const float CANVAS_HEIGHT = 600.0f;

float cursorX = 400.0f;
float cursorY = 300.0f;

float* samples = 0;

void setCursorPosition(float x, float y) {
  cursorX = x;
  cursorY = y;
}

void onMouseDown() {
  prints("ya clicked");
  printfl(cursorX);
  printfl(cursorY);
}

void onMouseUp() {
  prints("ya un-clicked");
}
