#ifdef OS_LINUX
#include <errno.h>
#include <pthread.h>
#include <unistd.h>
#include <wait.h>
#endif

#include "npfunctions.h"

#include "log.h"
#include "downloader_script_object.h"
#include "plugin_factory.h"

#ifdef OS_WIN
HMODULE g_hMod;
#elif defined OS_LINUX
pthread_t wait_process_tid = 0;
#endif

Log g_logger;

extern NPNetscapeFuncs* g_npn_funcs;

#ifdef OS_WIN
BOOL OSCALL DllMain(HMODULE hModule, DWORD reason, LPVOID lpReserved) {
  g_hMod = hModule;
  switch(reason) {
    case DLL_PROCESS_ATTACH:
      g_logger.OpenLog("NPAPI");
      g_logger.WriteLog("Msg","DLL_PROCESS_ATTACH");
      break;
    case DLL_THREAD_ATTACH:
      break;
    case DLL_THREAD_DETACH:
      break;
    case DLL_PROCESS_DETACH:
      g_logger.WriteLog("Msg","DLL_PROCESS_DETACH");
      break;
  }
  return TRUE;
}
#endif

#ifdef OS_LINUX
void* WaitChildProcess(void* param) {
  while(true) {
    int ret_val = 0;
    pid_t pid = wait(&ret_val);
    if (pid == -1) {
      sleep(1);
    } else {
      DownloaderScriptObject::DownloadFinish(pid, ret_val);
    }
  }
}
#endif

#ifdef __cplusplus
extern "C" {
#endif
  NPError OSCALL NP_GetEntryPoints(NPPluginFuncs* nppfuncs) {
    nppfuncs->version = (NP_VERSION_MAJOR << 8) | NP_VERSION_MINOR;
    nppfuncs->newp = NPP_New;
    nppfuncs->destroy = NPP_Destroy;
    nppfuncs->setwindow = NPP_SetWindow;
    nppfuncs->newstream = NPP_NewStream;
    nppfuncs->destroystream = NPP_DestroyStream;
    nppfuncs->asfile = NPP_StreamAsFile;
    nppfuncs->writeready = NPP_WriteReady;
    nppfuncs->write = NPP_Write;
    nppfuncs->print = NPP_Print;
    nppfuncs->event = NPP_HandleEvent;
    nppfuncs->urlnotify = NPP_URLNotify;
    nppfuncs->getvalue = NPP_GetValue;
    nppfuncs->setvalue = NPP_SetValue;
    return NPERR_NO_ERROR;
  }

#ifndef HIBYTE
#define HIBYTE(x) ((((unsigned short)(x)) & 0xff00) >> 8)
#endif

NPError OSCALL NP_Initialize(NPNetscapeFuncs* npnf
#if !defined(OS_WIN) && !defined(WEBKIT_DARWIN_SDK)
               , NPPluginFuncs *nppfuncs) {
#else
               ) {
#endif
  PluginFactory::Init();
  g_logger.OpenLog("DA");
#ifdef OS_LINUX
  DownloaderScriptObject::Init();
  pthread_create(&wait_process_tid, NULL, WaitChildProcess, 0);
#endif
  if(npnf == NULL) {
    return NPERR_INVALID_FUNCTABLE_ERROR;
  }

  if(HIBYTE(npnf->version) > NP_VERSION_MAJOR) {
    return NPERR_INCOMPATIBLE_VERSION_ERROR;
  }
  g_npn_funcs = npnf;
#if !defined(OS_WIN) && !defined(WEBKIT_DARWIN_SDK)
  NP_GetEntryPoints(nppfuncs);
#endif

  return NPERR_NO_ERROR;
}

NPError  OSCALL NP_Shutdown() {
#ifdef OS_LINUX
  DownloaderScriptObject::UnInit();
  if (wait_process_tid != 0) {
    pthread_cancel(wait_process_tid);
  }
#endif

  return NPERR_NO_ERROR;
}

char MIMEType[] = "application/x-npdownload::Download Helper";
char* NP_GetMIMEDescription(void) {
  return MIMEType;
}

// Needs to be present for WebKit based browsers.
NPError OSCALL NP_GetValue(void* npp, NPPVariable variable, void* value) {
  return NPP_GetValue((NPP)npp, variable, value);
}
#ifdef __cplusplus
}
#endif
