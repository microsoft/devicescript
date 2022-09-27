#pragma once
#include <stdint.h>

typedef uint16_t jacs_small_size_t;
typedef uint16_t jacs_key_id_t;

typedef struct {
    uintptr_t header;
    // ...
} jacs_gc_object_t;

typedef struct {
    // same layout as jacs_array_t
    jacs_gc_object_t gc;
    jacs_small_size_t length;
    jacs_small_size_t capacity;
    value_t *data;
} jacs_map_t;

static inline jacs_key_id_t *jacs_map_keys(jacs_map_t *m) {
    return (jacs_key_id_t *)(void *)(m->data + m->length);
}

typedef struct {
    // same layout as jacs_map_t
    jacs_gc_object_t gc;
    jacs_small_size_t length;
    jacs_small_size_t capacity;
    value_t *data;
} jacs_array_t;

void *jd_gc_try_alloc(uint32_t size);
void jd_gc_free(void *ptr);

jacs_map_t *jacs_map_try_alloc(void);
jacs_map_t *jacs_array_try_alloc(void);

