#ifndef DOWNLOAD_HELPER_PLUGIN_H_
#define	DOWNLOAD_HELPER_PLUGIN_H_

#include "plugin_base.h"
#include "script_object_base.h"

class DownloadHelperPlugin : public PluginBase {
public:
  DownloadHelperPlugin() {}
  virtual ~DownloadHelperPlugin() {}
    
  NPError Init(NPP instance, uint16_t mode, int16_t argc, char* argn[],
               char* argv[], NPSavedData* saved);
  NPError UnInit(NPSavedData** save);
  NPError GetValue(NPPVariable variable, void *value);

  static PluginBase* CreateObject() { return new DownloadHelperPlugin; }

private:
  ScriptObjectBase* scriptobject_;
};

#endif	/* DOWNLOADHELPERPLUGIN_H */

