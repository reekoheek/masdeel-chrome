#include "stdafx.h"

#include "utils.h"

TCHAR* Utils::Utf8ToUnicode(char *utf8) {
  int length = MultiByteToWideChar(CP_UTF8, 0, utf8, -1, NULL, 0);
  TCHAR *unicode = new TCHAR[length];
  MultiByteToWideChar(CP_UTF8, 0, utf8, -1, unicode, length);
  return unicode;
}

SAFEARRAY* Utils::CreateArray(uint32_t length) {
  SAFEARRAYBOUND rgsabound[1];
  rgsabound[0].lLbound = 0;
  rgsabound[0].cElements = length;
  SAFEARRAY *psa = SafeArrayCreate(VT_VARIANT, 1, rgsabound);
  return psa;
}

VARIANT Utils::ToVariant(SAFEARRAY* psa) {
  VARIANT vList;
  vList.vt = VT_VARIANT | VT_ARRAY | VT_BYREF;
  vList.pparray = &psa;
  return vList;
}

HRESULT Utils::GetCom(REFCLSID rclsid, REFIID riid, __deref_out LPVOID* ppv) {
  return CoCreateInstance(rclsid, NULL, CLSCTX_INPROC_SERVER, riid, ppv);
}
