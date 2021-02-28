// JS imports
float sin(float rads);
float printf(float input);
void printp(void *input);
float random();

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
  adsr.a_t = 1.5f;
  adsr.r_t = 2.2f;
  adsr.l_a = 0.0f;
  adsr.t = 0.0f;

  new_osc.adsr = adsr;
  new_osc.frequency = frequency;
  new_osc.phase = random() * TWO_PI;

  return new_osc;
}

void osc_attack(osc *o) {
  adsr_attack(&o->adsr);
}

void osc_release(osc *o) {
  adsr_release(&o->adsr);
}

void osc_reset_phase(osc *o) {
  float wavelength = (float) SAMPLE_RATE / o->frequency;
  o->phase += (BUFFER_SIZE / wavelength) * TWO_PI;
  int divisions = (int) (o->phase / TWO_PI);
  o->phase -= divisions * TWO_PI;
}

static float *buffer;
static unsigned int osc_count = 13;
static osc oscillators[13];

void init() {
  buffer = mmalloc(sizeof(float) * BUFFER_SIZE);

  oscillators[0] = osc_make(261.6256f); // C4
  oscillators[1] = osc_make(277.1826f); // C#
  oscillators[2] = osc_make(293.6648f); // D
  oscillators[3] = osc_make(311.1270f); // D#
  oscillators[4] = osc_make(329.6276f); // E
  oscillators[5] = osc_make(349.2282f); // F
  oscillators[6] = osc_make(369.9944f); // F#
  oscillators[7] = osc_make(391.9954f); // G
  oscillators[8] = osc_make(415.3047f); // G#
  oscillators[9] = osc_make(440.0f); // A
  oscillators[10] = osc_make(466.1638f); // A#
  oscillators[11] = osc_make(493.8833f); // B
  oscillators[12] = osc_make(523.2511f); // C5
}

void trigger_attack(unsigned int index) {
  osc_attack(&oscillators[index]);
}

void trigger_release(unsigned int index) {
  osc_release(&oscillators[index]);
}

void adjust_attack(float new_attack) {
  for (int i = 0; i < osc_count; i++) {
    osc* o = &oscillators[i];
    o->adsr.a_t = new_attack;
  }
}

void adjust_release(float new_release) {
  for (int i = 0; i < osc_count; i++) {
    osc* o = &oscillators[i];
    o->adsr.r_t = new_release;
  }
}

/* Prepares the 128 sample output buffer for playback */
void dispatch() {
  for (int i = 0; i < 128; i++) {
    buffer[i] = 0.0f;
    for (int note = 0; note < osc_count; note++) {
      osc *oscillator = &oscillators[note];
      float amplitude = adsr_amplitude(&oscillator->adsr);
      float wavelength = (float) SAMPLE_RATE / oscillator->frequency;
      float sinx = oscillator->phase + (i / wavelength) * TWO_PI;
      buffer[i] += amplitude * sin(sinx);
      oscillator->adsr.t = oscillator->adsr.t + 1.0f / SAMPLE_RATE;
    }
  }

  for (int note = 0; note < osc_count; note++) {
    osc *oscillator = &oscillators[note];
    osc_reset_phase(oscillator);
  }
}

