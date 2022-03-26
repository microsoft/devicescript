#include "jd_sdk.h"
#include <pthread.h>

typedef struct linked_frame {
    struct linked_frame *next;
    jd_frame_t frame;
} linked_frame_t;

static pthread_mutex_t frame_mut;
static linked_frame_t *rx_queue;

int jd_rx_frame_received(jd_frame_t *frame) {
    if (!frame)
        return 0;
    linked_frame_t *lnk = jd_alloc(JD_FRAME_SIZE(frame) + sizeof(void *));
    memcpy(&lnk->frame, frame, JD_FRAME_SIZE(frame));
    lnk->next = NULL;
    pthread_mutex_lock(&frame_mut);
    if (rx_queue) {
        linked_frame_t *last = rx_queue;
        while (last->next)
            last = last->next;
        last->next = lnk;
    } else {
        rx_queue = lnk;
    }
    pthread_mutex_unlock(&frame_mut);
    return 1;
}

void jd_rx_init() {
    pthread_mutex_init(&frame_mut, NULL);
}

jd_frame_t *jd_rx_get_frame(void) {
    jd_frame_t *r = NULL;
    pthread_mutex_lock(&frame_mut);
    if (rx_queue) {
        r = &rx_queue->frame;
        rx_queue = rx_queue->next;
    }
    pthread_mutex_unlock(&frame_mut);
    return r;
}

void jd_rx_release_frame(jd_frame_t *frame) {
    jd_free((uint8_t *)frame - offsetof(linked_frame_t, frame));
}
