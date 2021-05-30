#ifndef __MEM_H__
#define __MEM_H__

extern unsigned char __heap_base;

// Why? The compiler occasionally will optimize large inline arrays
// by placing them in .data (?), then memcpy-ing them out, or something.
// There doesn't appear to be any way around this:
//     https://www.raspberrypi.org/forums/viewtopic.php?t=219687
void* memcpy(void* dest, const void* src, unsigned int n);

/**
   An unfreeable memory allocator.
   This makes sense in wasm where we don't actually "allocate"
   memory at all. Instead we just want a simple way to mark the location of
   the next memory block so we don't need to remember.
*/
void* mmalloc(unsigned int size);

void markmem();

/**
  Instead of freeing, just allow resetting of the pointer.
  Requires a little more care, but is easy to implement
  */
void resetmem();

#endif