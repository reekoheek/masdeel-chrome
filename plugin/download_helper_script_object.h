#ifndef DOWNLOAD_HELPER_SCRIPT_OBJECT_H_
#define	DOWNLOAD_HELPER_SCRIPT_OBJECT_H_

#include <string>

#include "script_object_base.h"

class DownloadHelperScriptObject :public ScriptObjectBase {
protected:
  DownloadHelperScriptObject() {}
  virtual ~DownloadHelperScriptObject() {}

public:
  static NPObject* Allocate(NPP npp, NPClass *aClass);

  void Deallocate();
  void Invalidate() {}
  bool Construct(const NPVariant *args,uint32_t argCount,
                 NPVariant *result) { return true; }

  bool CreateObject(const NPVariant *args, uint32_t argCount,
                    NPVariant *result);

  bool CheckObject(const NPVariant *args, uint32_t argCount,
                   NPVariant *result);

  bool CopyToClipboard(const NPVariant *args, uint32_t argCount,
                       NPVariant *result);

  // Open user defined download path using explorer.
  bool OpenDownloadPath(const NPVariant *args, uint32_t argCount,
                        NPVariant *result);

  // Open download file path
  bool OpenDownloadFilePath(const NPVariant *args, uint32_t argCount,
                            NPVariant *result);

  // Open path selector for user to select a path of downloading, and return
  // this value to front-end.
  bool SetDownloadPath(const NPVariant *args, uint32_t argCount,
                       NPVariant *result);

  // Set download path to plugin
  bool UpdateDownloadPath(const NPVariant *args, uint32_t argCount,
                          NPVariant *result);

  // Front-end calls this function to get a user default downloads path.
  bool GetDefaultDownloadPath(const NPVariant *args, uint32_t argCount,
                              NPVariant *result);

  void InitHandler();

  static std::string& download_path() { return download_path_; }

private:
  static std::string download_path_;
};

#endif	/* DOWNLOADHELPERSCRIPTOBJECT_H */

