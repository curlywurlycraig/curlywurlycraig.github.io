// JS imports
void prints(const char *address);
void printfl(float num);
float random();
float sin(float rads);
float cos(float rads);
float tan(float rads);
void dispatchAudioFrame(const float *samples);

#include "mem.c"

#define SAMPLE_COUNT 256

const float CANVAS_WIDTH = 800.0f;
const float CANVAS_HEIGHT = 600.0f;

float cursorX = 400.0f;
float cursorY = 300.0f;
float amplitude = 0.0f;

float* samples;
void init() {
  samples = (float*) mmalloc(sizeof(float) * 256);
}

float* weirdsin() {
  for (int i = 0; i < SAMPLE_COUNT; i++) {
    samples[i] = amplitude * sin(cursorX * i / 1280.0f);
  }

  return samples;
}

void setCursorPosition(float x, float y) {
  cursorX = x;
  cursorY = y;

  weirdsin();
}

void onMouseDown() {
}

void onMouseUp() {
}

int is_playing = 0;
void toggle() {
  if (is_playing) {
    amplitude = 0.0f;
    is_playing = 0;
  } else {
    amplitude = 1.0f;
    is_playing = 1;
  }

  weirdsin();
}
