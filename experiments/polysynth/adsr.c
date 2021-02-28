typedef enum adsr_state {
  none,
  attack,
  decay,
  sustain,
  release
} adsr_state;

typedef struct adsr_envelope {
  adsr_state state;
  float amp;
  float a;
  float d;
  float s;
  float r;
  float t;
  float l_a; // amplitude at last state
} adsr_envelope;

float lin_interp(float from, float to, float percentage) {
  return from + (to - from) * percentage;
}

float adsr_amplitude(adsr_envelope* env) {
  switch (env->state) {
  case none:
    return 0.0f;
  case attack:
    return lin_interp(env->l_a, env->amp, (env->t / env->a));
  case decay:
    return lin_interp(env->amp, env->s, (env->t / env->d));
  case sustain:
    return env->s;
  case release:
    if (env->t > env->r) {
      return 0.0f;
    }

    return lin_interp(env->l_a, 0, (env->t / env->r));
  default:
    // Should be impossible
    return 0.0f;
  }
}

void adsr_attack(adsr_envelope* env) {
  env->l_a = adsr_amplitude(env);
  env->t = 0.0f;
  env->state = attack;
}

void adsr_release(adsr_envelope* env) {
  env->l_a = adsr_amplitude(env);
  env->t = 0.0f;
  env->state = release;
}

void adsr_advance(adsr_envelope* env, float t) {
  env->t += t;

  switch (env->state) {
  case attack:
    if (env->t > env->a) {
      env->t = env->t - env->a;
      env->state = decay;
    }
    return;
  case decay:
    if (env->t > env->d) {
      env->t = env->t - env->d;
      env->state = sustain;
    }
    return;
  default:
    return;
  }
}
