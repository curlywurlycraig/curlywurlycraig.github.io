// JS imports
float sin(float rads);
float printf(float input);

#include "mem.c"

#define SAMPLE_RATE 44100

float* buffer;
float phase;

void init() {
  buffer = mmalloc(sizeof(float) * 128);
  phase = 0.0f;
}

void gen(float frequency, float amplitude) {
  float two_pi = 2.0f * 3.1415;
  float wavelength = (float) SAMPLE_RATE / frequency;

  for (int i = 0; i < 128; i++) {
    float sinx = phase + (i / wavelength) * two_pi;
    buffer[i] = amplitude * sin(sinx);
  }

  phase = phase + (128 / wavelength) * two_pi;
  while (phase > two_pi) {
    phase -= two_pi;
  }
}

