#ifndef LOG_H_
#define LOG_H_

#include <stdio.h>

#ifdef OS_WIN
#include <windows.h>
#endif

class Log {
public:
  Log(void);
  ~Log(void);

  bool OpenLog(const char* header);
  bool WriteLog(const char* title, const char* contents);
  bool CloseLog();

private:
  FILE* file_;
#ifdef OS_WIN
  SYSTEMTIME time_;
#endif
};

#endif