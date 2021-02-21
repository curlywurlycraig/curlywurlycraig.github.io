// JS imports
float sin(float rads);
float printf(float input);

#include "mem.c"
#include "adsr.c"

#define SAMPLE_RATE 44100

float* buffer;
float* phases;
float* frequencies;
adsr_envelope adsr;

void init() {
  buffer = mmalloc(sizeof(float) * 128);
  phases = mmalloc(sizeof(float) * 3);
  for (int i = 0; i < 3; i++) phases[i] = 0;

  frequencies = mmalloc(sizeof(float) * 3);
  frequencies[0] = 440.0f; // A
  frequencies[1] = 554.3653f; // C#
  frequencies[2] = 659.2551; // E

  adsr.state = none;
  adsr.a_a = 0.2f;
  adsr.a_t = 0.002f;
  adsr.r_t = 0.5f;
  adsr.l_a = 0.0f;
  adsr.t = 0;
}

void trigger_attack() {
  adsr_attack(&adsr);
}

void trigger_release() {
  adsr_release(&adsr);
}

/* Prepares the 128 sample output buffer for playback */
void dispatch() {
  float two_pi = 2.0f * 3.1415;

  for (int i = 0; i < 128; i++) {
    float amplitude = adsr_amplitude(&adsr);
    buffer[i] = 0.0f;
    for (int note = 0; note < 3; note++) {
      float wavelength = (float) SAMPLE_RATE / frequencies[note];
      float sinx = phases[note] + (i / wavelength) * two_pi;
      buffer[i] += amplitude * sin(sinx);
    }

    adsr.t += 1.0f / SAMPLE_RATE;
  }

  for (int note = 0; note < 3; note++) {
    float wavelength = (float) SAMPLE_RATE / frequencies[note];
    phases[note] = phases[note] + (128 / wavelength) * two_pi;
    int divisions = (int) (phases[note] / two_pi);
    phases[note] = phases[note] - (divisions * two_pi);
  }
}

