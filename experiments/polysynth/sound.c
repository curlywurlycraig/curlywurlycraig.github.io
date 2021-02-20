// JS imports
float sin(float rads);
float printf(float input);

#include "mem.c"

#define SAMPLE_RATE 44100

typedef enum adsr_state {
  none,
  attack,
  decay,
  sustain,
  release
} adsr_state;

typedef struct adsr_envelope {
  adsr_state state;
  float a_a;
  float a_t;
  float r_t;
  float t;
} adsr_envelope;

float get_amplitude(adsr_envelope* env) {
  switch (env->state) {
  case none:
    return 0.0f;
  case attack:
    if (env->t > env->a_t) {
      return env->a_a;
    }
    return env->a_a * env->t / env->a_t;
  case release:
    if (env->t > env->r_t) {
      return 0.0f;
    }

    float proportion = env->t / env->r_t;
    return env->a_a - (env->a_a * proportion);
  default:
    // TODO Handle decay + sustain
    return 0.0f;
  }
}

void adsr_attack(adsr_envelope* env) {
  env->t = 0.0f;
  env->state = attack;
}

void adsr_release(adsr_envelope* env) {
  env->t = 0.0f;
  env->state = release;
}

float* buffer;
float* phases;
float* frequencies;
adsr_envelope adsr;

void init() {
  buffer = mmalloc(sizeof(float) * 128);
  phases = mmalloc(sizeof(float) * 3);
  for (int i = 0; i < 3; i++) phases[i] = 0;

  frequencies = mmalloc(sizeof(float) * 3);
  frequencies[0] = 440.0f / 2.0f; // A
  frequencies[1] = 554.3653f / 2.0f; // C#
  frequencies[2] = 659.2551 / 2.0f; // E

  adsr.state = none;
  adsr.a_a = 0.2f;
  adsr.a_t = 0.05f;
  adsr.r_t = 0.5f;
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
  float amplitude = get_amplitude(&adsr);

  for (int i = 0; i < 128; i++) {
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

