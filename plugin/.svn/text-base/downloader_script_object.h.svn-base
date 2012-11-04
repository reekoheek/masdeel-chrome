#ifndef DOWNLOADER_SCRIPT_OBJECT_H
#define DOWNLOADER_SCRIPT_OBJECT_H

#include <string>
#include <vector>

#include "script_object_base.h"

class DownloaderScriptObject : public ScriptObjectBase {
public:
  DownloaderScriptObject(void) {}
  virtual ~DownloaderScriptObject(void) {}
  
  static NPObject* Allocate(NPP npp, NPClass *aClass);

  void Deallocate();
  virtual void Invalidate() {}
  virtual bool Construct(const NPVariant *args, uint32_t argCount,
                         NPVariant *result) { return true; }

  virtual bool Download(const NPVariant *args, uint32_t argCount,
                        NPVariant *result);
  virtual bool DownloadAll(const NPVariant *args, uint32_t argCount,
                           NPVariant *result);

  void InitHandler();

#ifdef OS_LINUX
  void set_execute_file(const char* name) { execute_file_ = name; }
  static void Init();
  static void UnInit();
  static void NotifyFrontEnd(__pid_t pid, int retvalue);
  static void DownloadFinish(__pid_t pid, int retvalue);
  static int TimerFunction(void* param);
#endif

private:
#ifdef OS_LINUX
  std::string execute_file_;
  typedef std::map<__pid_t, std::string> DownloadMap;
  typedef std::map<__pid_t, int> IntMap;
  static IntMap download_result_list_;
  static DownloadMap download_process_list_;
  static DownloaderScriptObject* script_object_;
  static unsigned int timer_id_;
  static pthread_mutex_t mutex_;
#endif
  
};

#endif
