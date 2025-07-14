// JS imports
float sin(float rads);
float printf(float input);

#include "mem.c"

float wavelength = 310.0f;

float* buffer;

void init() {
  buffer = mmalloc(sizeof(float) * 128);
}

void gen(float frequency) {
  float two_pi = 2.0f * 3.1415;

  for (int i = 0; i < 128; i++) {
    buffer[i] = sin(two_pi * ((float) i / 128.0f));
  }
}

