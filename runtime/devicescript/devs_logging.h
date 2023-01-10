#pragma once

#ifndef LOGGING
#ifdef LOG_TAG
#define LOGGING 1
#else
#define LOGGING 0
#endif
#endif

#ifndef VLOGGING
#define VLOGGING 0
#endif

#ifndef LOG_TAG
#define LOG_TAG ""
#endif

#if LOGGING
#define LOG(msg, ...) JD_LOG(LOG_TAG ": " msg, ##__VA_ARGS__)
#define LOG_VAL(lbl, val) devs_log_value(ctx, LOG_TAG ": " lbl, val)
#else
#define LOG JD_NOLOG
#define LOG_VAL JD_NOLOG
#endif

#if VLOGGING
#define LOGV(msg, ...) JD_LOG(LOG_TAG ": " msg, ##__VA_ARGS__)
#else
#define LOGV JD_NOLOG
#endif
