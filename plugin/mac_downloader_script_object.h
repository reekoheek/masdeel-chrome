#ifndef MAC_DOWNLOADER_SCRIPT_OBJECT_H
#define MAC_DOWNLOADER_SCRIPT_OBJECT_H

#include "downloader_script_object.h"

class MacDownloaderScriptObject : public DownloaderScriptObject {
public:
  MacDownloaderScriptObject() {}
  virtual ~MacDownloaderScriptObject() {}
  
  static NPObject* Allocate(NPP npp, NPClass* aClass);
  
  void Deallocate();
  
  bool Download(const NPVariant* args, uint32_t argCount, NPVariant* result);
  void InitHandler();
  void set_app_name(const char* name) { app_name_ = name; }
  
private:
  std::string app_name_;
  
};
#endif