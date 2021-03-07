// JS imports
extern float sin(float rads);
extern float printf(float input);
extern void printp(void *input);
extern float random();

#include "mem.c"

#define SAMPLE_RATE 44100
#define BUFFER_SIZE 128
#define TWO_PI 6.283f

// Two minutes
// TODO Allow specifying actual length by the user.
// Still fine to hard code absolute max tho
#define MAX_EDITOR_BUFFER_LENGTH_SECS 5292000

static float *outputBuffer;
static float *editorBuffer;

static int isPlaying;
static int playingSamplePosition;
static int maxSamplePosition;
static unsigned int selectStart;
static unsigned int selectEnd;

void init() {
  outputBuffer = mmalloc(sizeof(float) * BUFFER_SIZE);
  editorBuffer = mmalloc(sizeof(float) * MAX_EDITOR_BUFFER_LENGTH_SECS);
  printp(outputBuffer);
  printp(editorBuffer);
  isPlaying = 0;
  playingSamplePosition = 0;
  maxSamplePosition = 0;
}

/* Prepares the 128 sample output buffer for playback. Returns the
location of the output buffer */
float* dispatch() {
  if (!isPlaying || playingSamplePosition >= maxSamplePosition) {
    return 0;
  }

  for (int i = 0; i < 128; i++) {
    if (playingSamplePosition >= maxSamplePosition) {
      outputBuffer[i] = 0;
      continue;
    }

    outputBuffer[i] = editorBuffer[playingSamplePosition];
    playingSamplePosition++;
  }

  return outputBuffer;
}

float* provideOutputBuffer() {
  return outputBuffer;
}

float* provideEditorBuffer() {
  return editorBuffer;
}

void playLen(unsigned int numberSamples) {
  playingSamplePosition = 0;
  maxSamplePosition = numberSamples;
  isPlaying = 1;
}
