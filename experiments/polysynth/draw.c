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

float wavelength = 310.0f;

void example_1(int width, int height) {
  clear();
  beginPath();
  float mid = height / 2.0f;
  float two_pi = 2.0f * 3.1415;
  moveTo(0, mid);

  for (int i = 0; i < width; i++) {
    lineTo(i, mid - sin(two_pi * ((float) i / wavelength)) * mid);
  }

  stroke();
}

void example_2(int width, int height) {
  clear();
  beginPath();
  float mid = height / 2.0f;
  float two_pi = 2.0f * 3.1415;
  moveTo(0, mid);

  for (int i = 0; i < width / 2.0f; i++) {
    lineTo(i, mid - sin(two_pi * ((float) i / wavelength)) * mid);
  }

  for (int i = 0; i < width / 2.0f; i++) {
    lineTo(i + width / 2.0f, mid - sin(two_pi * ((float) i / wavelength)) * mid);
  }

  stroke();
}

void example_3(int width, int height, float animation_percent) {
  clear();
  beginPath();
  float mid = height / 2.0f;
  float two_pi = 2.0f * 3.1415;
  moveTo(0, mid);

  float animated_wavelength = wavelength * (1 + animation_percent);

  for (int i = 0; i < width / 2.0f; i++) {
    lineTo(i, mid - sin(two_pi * ((float) i / animated_wavelength)) * mid);
  }

  for (int i = 0; i < width / 2.0f; i++) {
    lineTo(i + width / 2.0f, mid - sin(two_pi * ((float) i / animated_wavelength)) * mid);
  }

  stroke();
}

