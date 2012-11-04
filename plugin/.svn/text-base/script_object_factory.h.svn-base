#ifndef SCRIPT_OBJECT_FACTORY_H_
#define SCRIPT_OBJECT_FACTORY_H_

#include "script_object_base.h"

class ScriptObjectFactory {
private:
  ScriptObjectFactory(void);
  ~ScriptObjectFactory(void);

public:
  static ScriptObjectBase* CreateObject(NPP npp,
                                        NPAllocateFunctionPtr allocate);

};

#endif