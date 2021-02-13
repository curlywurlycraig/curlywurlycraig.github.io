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

#define SAMPLE_COUNT 128
#define CANVAS_WIDTH 800.0f
#define CANVAS_HEIGHT 600.0f

float cursorX = 0.0f;
float cursorY = 0.0f;

int is_mouse_down = 0;
float amplitude = 1.0f;
float* samples;

void draw_buffer_to_canvas() {
  clear();
  beginPath();
  moveTo(0, CANVAS_HEIGHT / 2.0f);
  float sample_width = CANVAS_WIDTH / SAMPLE_COUNT;

  for (int i = 0; i < SAMPLE_COUNT; i++) {
    lineTo(i * sample_width, ((samples[i] * -1.0f) + 1) * CANVAS_HEIGHT / 2.0);
  }

  stroke();
}

float* generate_buffer() {
  float two_pi = (2.0f * 3.1415f);
  for (int i = 0; i < SAMPLE_COUNT; i++) {
    samples[i] = amplitude * sin(two_pi * ((float) i / SAMPLE_COUNT));
  }

  return samples;
}

void init() {
  samples = (float*) mmalloc(sizeof(float) * SAMPLE_COUNT);
  generate_buffer();
  draw_buffer_to_canvas();
}

int is_playing = 0;
void toggle() {
  if (is_playing) {
    amplitude = 0.0f;
    is_playing = 0;
  } else {
    amplitude = 1.0f;
    is_playing = 1;
  }

  generate_buffer();
}

void set_sample_at_cursor() {
  // update buffer
  // TODO Why x2?
  unsigned int cursor_pos_as_index = 2.0f * (cursorX / CANVAS_WIDTH) * SAMPLE_COUNT;
  float cursor_pos_as_sample = (-4.0f * cursorY / CANVAS_HEIGHT) + 1.0f;
  samples[cursor_pos_as_index] = cursor_pos_as_sample;

  // redraw lines
  draw_buffer_to_canvas();
}

void setCursorPosition(float x, float y) {
  cursorX = x;
  cursorY = y;

  if (is_mouse_down) {
    set_sample_at_cursor();
  }
}

void onMouseDown() {
  is_mouse_down = 1;
  set_sample_at_cursor();
}

void onMouseUp() {
  is_mouse_down = 0;
}

