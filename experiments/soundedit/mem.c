extern unsigned char __heap_base;

// Why? The compiler occasionally will optimize large inline arrays
// by placing them in .data (?), then memcpy-ing them out, or something.
// There doesn't appear to be any way around this:
//     https://www.raspberrypi.org/forums/viewtopic.php?t=219687
void* memcpy(void* dest, const void* src, unsigned int n) {
  char* d = (char *) dest;
  char* s = (char *) src;

  for (int i = 0; i < n; i++) {
    *(d+i) = *(s+i);
  }

  return dest;
}

void* p = &__heap_base;
/**
   An unfreeable memory allocator.
   This makes sense in wasm where we don't actually "allocate"
   memory at all. Instead we just want a simple way to mark the location of
   the next memory block so we don't need to remember.
*/
void* mmalloc(unsigned int size) {
  void* result = p;
  p += size;
  return result;
}
