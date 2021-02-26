// JS imports
float sin(float rads);
float printf(float input);
void printp(void *input);

#include "mem.c"
#include "adsr.c"

#define SAMPLE_RATE 44100
#define BUFFER_SIZE 128
#define TWO_PI 6.283f

typedef struct osc {
  adsr_envelope adsr;
  float frequency;
  float phase;
} osc;

osc osc_make(float frequency) {
  osc new_osc;
  adsr_envelope adsr;
  adsr.state = none;
  adsr.a_a = 0.2f;
  adsr.a_t = 0.005f;
  adsr.r_t = 0.5f;
  adsr.l_a = 0.0f;
  adsr.t = 0.0f;

  new_osc.adsr = adsr;
  new_osc.frequency = frequency;
  new_osc.phase = 0.0f;

  return new_osc;
}

void osc_attack(osc *o) {
  adsr_attack(&o->adsr);
}

void osc_release(osc *o) {
  adsr_release(&o->adsr);
}

void osc_update_phase(osc *o) {
  float wavelength = (float) SAMPLE_RATE / o->frequency;
  o->phase += (BUFFER_SIZE / wavelength) * TWO_PI;
  int divisions = (int) (o->phase / TWO_PI);
  o->phase -= divisions * TWO_PI;
}

float *buffer;
osc oscillators[12];

void init() {
  buffer = mmalloc(sizeof(float) * BUFFER_SIZE);

  oscillators[0] = osc_make(261.6256f); // C
  oscillators[1] = osc_make(329.6276f); // E
  oscillators[2] = osc_make(391.9954f); // G
}

void trigger_attack() {
  osc_attack(&oscillators[0]);
  osc_attack(&oscillators[1]);
  osc_attack(&oscillators[2]);
}

void trigger_release() {
  osc_release(&oscillators[0]);
  osc_release(&oscillators[1]);
  osc_release(&oscillators[2]);
}

/* Prepares the 128 sample output buffer for playback */
void dispatch() {
  for (int i = 0; i < 128; i++) {
    buffer[i] = 0.0f;
    for (int note = 0; note < 3; note++) {
      osc *oscillator = &oscillators[note];
      float amplitude = adsr_amplitude(&oscillator->adsr);
      float wavelength = (float) SAMPLE_RATE / oscillator->frequency;
      float sinx = oscillator->phase + (i / wavelength) * TWO_PI;
      buffer[i] += amplitude * sin(sinx);
      oscillator->adsr.t = oscillator->adsr.t + 1.0f / SAMPLE_RATE;
    }
  }

  for (int note = 0; note < 3; note++) {
    osc *oscillator = &oscillators[note];
    osc_update_phase(oscillator);
  }
}

