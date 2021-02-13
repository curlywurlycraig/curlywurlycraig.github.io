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

float* samples;
void init() {
  samples = (float*) mmalloc(sizeof(float) * 256);
}

void setCursorPosition(float x, float y) {
  cursorX = x;
  cursorY = y;
}

void onMouseDown() {
}

void onMouseUp() {
}

float* silence() {
  for (int i = 0; i < SAMPLE_COUNT; i++) {
    samples[i] = 0;
  }

  return samples;
}

float* weirdsin() {
  for (int i = 0; i < SAMPLE_COUNT; i++) {
    samples[i] = sin(i / 1280.0f);
  }

  return samples;
}

int is_playing = 0;
float* toggle() {
  float* result;
  if (is_playing) {
    result = silence();
    is_playing = 0;
  } else {
    result = weirdsin();
    is_playing = 1;
  }

  return result;
}
