#include "mac_downloader_script_object.h"

#include <unistd.h>

#include "log.h"

extern Log g_logger;

NPObject* MacDownloaderScriptObject::Allocate(NPP npp, NPClass* aClass) {
  MacDownloaderScriptObject* script_object = new MacDownloaderScriptObject;
  char logs[256];
  sprintf(logs, "MacDownloaderScriptObject this=%ld", script_object);
  g_logger.WriteLog("Allocate", logs);
  if (script_object != NULL) {
    script_object->set_plugin((PluginBase*)npp->pdata);
  }
  return script_object;
}

void MacDownloaderScriptObject::Deallocate() {
  char logs[256];
  sprintf(logs, "MacDownloaderScriptObject this=%ld", this);
  g_logger.WriteLog("Deallocate",logs);
  delete this;
}

void MacDownloaderScriptObject::InitHandler() {
  FunctionItem item;
  item.function_name = "Download";
  item.function_pointer = ON_INVOKEHELPER(
      &DownloaderScriptObject::Download);
  AddFunction(item);
}

bool MacDownloaderScriptObject::Download(const NPVariant *args,
                                         uint32_t argCount,
                                         NPVariant *result) {
  if (argCount != 1 || !NPVARIANT_IS_STRING(args[0]))
    return false;
  
  const char* download_contents = NPVARIANT_TO_STRING(args[0]).UTF8Characters;
  unsigned int length = NPVARIANT_TO_STRING(args[0]).UTF8Length;
  
  std::string command = "osascript -e \"tell application \\\"";
  command += app_name_;
  command += "\\\"\" ";
  command += "-e \"";
  command.append(download_contents, length);
  command += "\" ";
  command += "-e \"end tell\"";
  system(command.c_str());
  
  return true;
}