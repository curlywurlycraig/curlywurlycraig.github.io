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

float lastCursorX = -1.0f;
float lastCursorY = -1.0f;
float cursorX = -1.0f;
float cursorY = -1.0f;

int is_mouse_down = 0;
float amplitude = 0.0f;
float* samples;
float* samplesBeforeAmplitudeChange;

void draw_buffer_to_canvas() {
  clear();
  beginPath();
  moveTo(0, CANVAS_HEIGHT / 2.0f);
  float sample_width = CANVAS_WIDTH / SAMPLE_COUNT;

  for (int i = 0; i < SAMPLE_COUNT; i++) {
    lineTo(i * sample_width, ((samplesBeforeAmplitudeChange[i] * -1.0f) + 1) * CANVAS_HEIGHT / 2.0);
  }

  stroke();
}

void applyAmplitude() {
  for (int i = 0; i < SAMPLE_COUNT; i++) {
    samples[i] = amplitude * samplesBeforeAmplitudeChange[i];
  }
}

void generate_buffer() {
  float two_pi = (2.0f * 3.1415f);
  for (int i = 0; i < SAMPLE_COUNT; i++) {
    samplesBeforeAmplitudeChange[i] = sin(two_pi * ((float) i / SAMPLE_COUNT));
  }
}

void init() {
  samples = (float*) mmalloc(sizeof(float) * SAMPLE_COUNT);
  samplesBeforeAmplitudeChange = (float*) mmalloc(sizeof(float) * SAMPLE_COUNT);
  generate_buffer();
  applyAmplitude();
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

  applyAmplitude();
}

float linear_interpolate(float startX, float startY, float endX, float endY, float currX) {
  float proportion = (currX - startX) / (endX - startX);
  return startY + proportion * (endY - startY);
}

// Sets samples at all positions between last and current cursor
// positions
void set_sample_at_cursor() {
  // update buffer
  unsigned int start_cursor_pos_as_index = (lastCursorX / CANVAS_WIDTH) * SAMPLE_COUNT;
  unsigned int end_cursor_pos_as_index = (cursorX / CANVAS_WIDTH) * SAMPLE_COUNT;
  float start_cursor_pos_as_sample = (-2.0f * lastCursorY / CANVAS_HEIGHT) + 1.0f;
  float end_cursor_pos_as_sample = (-2.0f * cursorY / CANVAS_HEIGHT) + 1.0f;

  if (start_cursor_pos_as_index == end_cursor_pos_as_index) {
    samplesBeforeAmplitudeChange[start_cursor_pos_as_index] = start_cursor_pos_as_sample;
  } else if (start_cursor_pos_as_index < end_cursor_pos_as_index) {
    for (unsigned int i = start_cursor_pos_as_index; i <= end_cursor_pos_as_index; i++) {
      samplesBeforeAmplitudeChange[i] = linear_interpolate(start_cursor_pos_as_index,
							   start_cursor_pos_as_sample,
							   end_cursor_pos_as_index,
							   end_cursor_pos_as_sample,
							   i);
    }
  } else {
    for (unsigned int i = end_cursor_pos_as_index; i <= start_cursor_pos_as_index; i++) {
      samplesBeforeAmplitudeChange[i] = linear_interpolate(end_cursor_pos_as_index,
							   end_cursor_pos_as_sample,
							   start_cursor_pos_as_index,
							   start_cursor_pos_as_sample,
							   i);
    }
  }

  // redraw lines
  draw_buffer_to_canvas();

  applyAmplitude();
}

// Cursor positions need to be multiplied by two because of screen
// scaling issues
void setCursorPosition(float x, float y) {
  lastCursorX = cursorX;
  lastCursorY = cursorY;

  cursorX = x * 2.0f;
  cursorY = y * 2.0f;

  if (is_mouse_down) {
    set_sample_at_cursor();
  }
}

void onMouseDown() {
  is_mouse_down = 1;
  lastCursorX = cursorX;
  lastCursorY = cursorY;

  set_sample_at_cursor();
}

void onMouseUp() {
  is_mouse_down = 0;
}

