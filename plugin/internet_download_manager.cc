#include "internet_download_manager.h"

#include <comutil.h>
#include <tchar.h>

#include "log.h"
#include "utils.h"

extern Log g_logger;

NPObject* InternetDownloadManager::Allocate(NPP npp, NPClass *aClass) {
  InternetDownloadManager* idm = new InternetDownloadManager;
  char logs[256];
  sprintf_s(logs, "InternetDownloadManager this=%ld", idm);
  g_logger.WriteLog("Allocate", logs);
  if (idm != NULL) {
    idm->set_plugin((PluginBase*)npp->pdata);
  }
  return idm;
}

void InternetDownloadManager::Deallocate() {
  char logs[256];
  sprintf_s(logs, "InternetDownloadManager this=%ld", this);
  g_logger.WriteLog("Deallocate", logs);
  delete this;
}

void InternetDownloadManager::InitHandler() {
  FunctionItem item;
  item.function_name = "Download";
  item.function_pointer = ON_INVOKEHELPER(&InternetDownloadManager::Download);
  AddFunction(item);
  item.function_name = "DownloadAll";
  item.function_pointer = ON_INVOKEHELPER(&InternetDownloadManager::
      DownloadAll);
  AddFunction(item);
}

bool InternetDownloadManager::CheckObject() {
  TCHAR idm_exe_path[MAX_PATH];
  DWORD buffer_len = sizeof(idm_exe_path);
  HKEY hkey;
  if (RegOpenKey(HKEY_CURRENT_USER, L"Software\\DownloadManager", &hkey))
    return false;
  if (RegQueryValueEx(hkey, L"ExePath", NULL, NULL, (LPBYTE)idm_exe_path,
                      &buffer_len)) {
    RegCloseKey(hkey);
    return false;
  }
  RegCloseKey(hkey);
  if (_taccess(idm_exe_path, 0))
    return false;
  return true;
}

bool InternetDownloadManager::Download(const NPVariant *args,
                                       uint32_t argCount,
                                       NPVariant *result) {
  if (argCount != 1 || !NPVARIANT_IS_STRING(args[0]))
    return false;

  BOOLEAN_TO_NPVARIANT(FALSE, *result);
  HRESULT hr = CoCreateInstance(__uuidof(CIDMLinkTransmitter), NULL, 
      CLSCTX_SERVER, __uuidof(ICIDMLinkTransmitter2), (LPVOID*)&disp_pointer_);

  if (hr != S_OK)
    return false;

  utils::Utf8ToUnicode url(NPVARIANT_TO_STRING(args[0]).UTF8Characters,
                           NPVARIANT_TO_STRING(args[0]).UTF8Length);

  VARIANT reserved;
  reserved.vt=VT_EMPTY;
  hr = disp_pointer_->SendLinkToIDM2((wchar_t*)url, "", "", "", "", "", "",
                                     "", 0, reserved, reserved);

  if (hr == S_OK)
    BOOLEAN_TO_NPVARIANT(true, *result);

  disp_pointer_->Release();
  return true;
}

bool InternetDownloadManager::DownloadAll(const NPVariant *args, 
                                          uint32_t argCount, 
                                          NPVariant *result) {
  if (argCount != 3 || !NPVARIANT_IS_OBJECT(args[0]) ||
      !NPVARIANT_IS_OBJECT(args[1]) || !NPVARIANT_IS_STRING(args[2]))
    return false;

  HRESULT hr = CoCreateInstance(__uuidof(CIDMLinkTransmitter), NULL, 
      CLSCTX_SERVER, __uuidof(ICIDMLinkTransmitter2), (LPVOID*)&disp_pointer_);
  if (hr != S_OK)
    return false;

  PluginBase* plugin = get_plugin();
  NPObject* linkObj = NPVARIANT_TO_OBJECT(args[0]);
  NPObject* commentObj = NPVARIANT_TO_OBJECT(args[1]);
  NPIdentifier id = NPN_GetStringIdentifier("length");
  NPVariant ret;
  if (NPN_GetProperty(plugin->get_npp(), linkObj, id, &ret) &&
    (NPVARIANT_IS_INT32(ret) || NPVARIANT_IS_DOUBLE(ret))) {
    int array_len = NPVARIANT_IS_INT32(ret) ? 
        NPVARIANT_TO_INT32(ret) : NPVARIANT_TO_DOUBLE(ret);
    SAFEARRAY* sa = NULL;
    SAFEARRAYBOUND bound[2];
    bound[0].lLbound = 0;
    bound[0].cElements = array_len;
    bound[1].lLbound = 0;
    bound[1].cElements = 4;
    sa = SafeArrayCreate(VT_BSTR, 2, bound);
    if (!sa)
      return false;

    long index[2];
    _bstr_t url, cookie(""), comment, refer;
    refer = utils::Utf8ToUnicode(NPVARIANT_TO_STRING(args[2]).UTF8Characters,
                                 NPVARIANT_TO_STRING(args[2]).UTF8Length);

    for (int i = 0; i < array_len; i++) {
      id = NPN_GetIntIdentifier(i);
      NPN_GetProperty(plugin->get_npp(), linkObj, id, &ret);
      if (!NPVARIANT_IS_STRING(ret))
        continue;
      url = utils::Utf8ToUnicode(NPVARIANT_TO_STRING(ret).UTF8Characters,
                                 NPVARIANT_TO_STRING(ret).UTF8Length);
      NPN_GetProperty(plugin->get_npp(), commentObj, id, &ret);
      if (!NPVARIANT_IS_STRING(ret))
        continue;
      comment = utils::Utf8ToUnicode(NPVARIANT_TO_STRING(ret).UTF8Characters,
                                     NPVARIANT_TO_STRING(ret).UTF8Length);

      index[0] = i;
      index[1] = 0;
      SafeArrayPutElement(sa, index, (BSTR)url);
      index[1] = 1;
      SafeArrayPutElement(sa, index, (BSTR)cookie);
      index[1] = 2;
      SafeArrayPutElement(sa, index, (BSTR)comment);
      index[1] = 3;
      SafeArrayPutElement(sa, index, NULL);
    }
    VARIANT array;
    VariantInit(&array);
    array.vt = VT_ARRAY | VT_BSTR;
    array.parray = sa;
    disp_pointer_->SendLinksArray(refer, &array);
    SafeArrayDestroy(sa);
  }

  disp_pointer_->Release();

  return true;
}
