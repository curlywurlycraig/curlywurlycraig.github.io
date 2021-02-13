// JS imports
void prints(const char *address);
void printfl(float num);
float random();
float sin(float rads);
float cos(float rads);
float tan(float rads);
void dispatchAudioFrame(const float *samples);

#include "mem.c"

#define SAMPLE_COUNT 128

const float CANVAS_WIDTH = 800.0f;
const float CANVAS_HEIGHT = 600.0f;

float cursorX = 0.0f;
float cursorY = 0.0f;

float amplitude = 0.0f;

float* samples;
void init() {
  samples = (float*) mmalloc(sizeof(float) * SAMPLE_COUNT);
}

float* generate_buffer() {
  for (int i = 0; i < SAMPLE_COUNT; i++) {

    samples[i] = amplitude * sin(i / (2.0f * 3.1415f));
  }

  return samples;
}

void set_samples(float new_samples[SAMPLE_COUNT]) {
  for (int i = 0; i < SAMPLE_COUNT; i++) {
    samples[i] = new_samples[i];
  }
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

  generate_buffer();
}

void setCursorPosition(float x, float y) {
  cursorX = x;
  cursorY = y;
}

void onMouseDown() {
}

void onMouseUp() {
}

