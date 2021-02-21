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
  float l_a;
} adsr_envelope;

float lin_interp(float from, float to, float percentage) {
  return from + (to - from) * percentage;
}

float adsr_amplitude(adsr_envelope* env) {
  switch (env->state) {
  case none:
    return 0.0f;
  case attack:
    if (env->t > env->a_t) {
      return env->a_a;
    }
    return lin_interp(env->l_a, env->a_a, (env->t / env->a_t));
  case release:
    if (env->t > env->r_t) {
      return 0.0f;
    }

    return lin_interp(env->l_a, 0, (env->t / env->r_t));
  default:
    // TODO Handle decay + sustain
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
