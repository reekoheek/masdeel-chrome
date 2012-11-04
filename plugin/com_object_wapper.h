#ifndef COM_OBJECT_WAPPER_H_
#define COM_OBJECT_WAPPER_H_

#include "downloader_script_object.h"

class ComObjectWapper : public DownloaderScriptObject {
private:
  ComObjectWapper(void);
  virtual ~ComObjectWapper(void);

public:
  static NPObject* Allocate(NPP npp, NPClass *aClass);

  virtual void Deallocate();
  virtual bool HasMethod(NPIdentifier name);
  virtual bool Invoke(NPIdentifier name, const NPVariant *args,
                      uint32_t argCount, NPVariant *result);
  virtual bool HasProperty(NPIdentifier name);
  virtual bool GetProperty(NPIdentifier name, NPVariant *result);
  virtual bool SetProperty(NPIdentifier name, const NPVariant *value);
  virtual bool RemoveProperty(NPIdentifier name);
  virtual bool Enumerate(NPIdentifier **value, uint32_t *count) { return false; }

  friend class DownloadHelperScriptObject;

private:
  bool FindFunctionByInvokeKind(const char* name, int invokekind);

private:
  IDispatch* disp_pointer_;
};

#endif