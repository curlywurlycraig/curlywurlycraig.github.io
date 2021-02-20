// JS imports
void prints(const char *address);
void printfl(float num);
float random();
float sin(float rads);
float cos(float rads);
float tan(float rads);
void dispatchAudioFrame(const float *samples);
void beginPath();
void stroke();
void moveTo(float x, float y);
void lineTo(float x, float y);
void clear();

#include "mem.c"

#define CANVAS_WIDTH 400
#define CANVAS_HEIGHT 200

void example_1() {
  clear();
  beginPath();
  float mid = CANVAS_HEIGHT / 2.0f;
  moveTo(0, mid);

  for (int i = 0; i < CANVAS_WIDTH; i++) {
    lineTo(i, mid - sin(i) * mid);
  }

  stroke();
}

