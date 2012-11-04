#ifndef INTERNET_DOWNLOAD_MANAGER_H_
#define INTERNET_DOWNLOAD_MANAGER_H_

#include <map>
#include <string>

#include "downloader_script_object.h"
#import "idmantypeinfo.tlb"

using namespace IDManLib;

class InternetDownloadManager : public DownloaderScriptObject {
private:
  InternetDownloadManager(void) {}
  virtual ~InternetDownloadManager(void) {}

public:
  static NPObject* Allocate(NPP npp, NPClass *aClass);
  void Deallocate();

  bool Download(const NPVariant *args, uint32_t argCount,
                NPVariant *result);
  bool DownloadAll(const NPVariant *args, uint32_t argCount,
                   NPVariant *result);

  void InitHandler();

  static bool CheckObject();

private:
  ICIDMLinkTransmitter2* disp_pointer_;

};

#endif