#include "downloader_script_object.h"

#include <stdlib.h>

#ifdef OS_LINUX
#include <unistd.h>
#include <wait.h>
#include <string.h>

#include <gtk/gtk.h>
#endif

#include "log.h"
#include "download_helper_script_object.h"

extern Log g_logger;

#ifdef OS_LINUX
DownloaderScriptObject::DownloadMap
    DownloaderScriptObject::download_process_list_;
DownloaderScriptObject* DownloaderScriptObject::script_object_ = NULL;
unsigned int DownloaderScriptObject::timer_id_ = 0;
DownloaderScriptObject::IntMap DownloaderScriptObject::download_result_list_;
pthread_mutex_t DownloaderScriptObject::mutex_;
#endif

NPObject* DownloaderScriptObject::Allocate(NPP npp, NPClass *aClass) {
  DownloaderScriptObject* script_object = new DownloaderScriptObject;
  char logs[256];
  sprintf(logs, "DownloaderScriptObject this=%ld", script_object);
  g_logger.WriteLog("Allocate",logs);
  if (script_object != NULL) {
    script_object->set_plugin((PluginBase*)npp->pdata);
#ifdef OS_LINUX
    script_object_ = script_object;
#endif
  }
  return script_object;
}

void DownloaderScriptObject::Deallocate() {
  char logs[256];
  sprintf(logs, "DownloaderScriptObject this=%ld", this);
  g_logger.WriteLog("Deallocate",logs);
  delete this;
}

void DownloaderScriptObject::InitHandler() {
  FunctionItem item;
  item.function_name = "Download";
  item.function_pointer = ON_INVOKEHELPER(
      &DownloaderScriptObject::Download);
  AddFunction(item);
  item.function_name = "DownloadAll";
  item.function_pointer = ON_INVOKEHELPER(
      &DownloaderScriptObject::DownloadAll);
  AddFunction(item);
}

#ifdef OS_LINUX
void DownloaderScriptObject::Init() {
  if (timer_id_ == 0) {
    pthread_mutex_init(&mutex_, NULL);
    timer_id_ = g_timeout_add_seconds(1, TimerFunction, 0);
  }
}

void DownloaderScriptObject::UnInit() {
  if (timer_id_ != 0) {
    g_source_remove(timer_id_);
    pthread_mutex_destroy(&mutex_);
  }
}

void DownloaderScriptObject::NotifyFrontEnd(__pid_t pid, int retvalue) {
  if (script_object_) {
    DownloadMap::iterator iter = download_process_list_.find(pid);
    if (iter != download_process_list_.end()) {
      NPObject* window;
      PluginBase* plugin = script_object_->get_plugin();
      NPN_GetValue(plugin->get_npp(), NPNVWindowNPObject, &window);
      NPIdentifier id = NPN_GetStringIdentifier("downloadCallback");
      NPVariant result;
      NPVariant args[2];
      INT32_TO_NPVARIANT(retvalue, args[0]);
      STRINGZ_TO_NPVARIANT(iter->second.c_str(), args[1]);
      VOID_TO_NPVARIANT(result);
      if (id) {
        NPN_Invoke(plugin->get_npp(), window, id, args, 2, &result);
        NPN_ReleaseVariantValue(&result);
      }
      download_process_list_.erase(iter);
    }
  }
}

void DownloaderScriptObject::DownloadFinish(__pid_t pid, int retvalue) {
  pthread_mutex_lock(&mutex_);
  download_result_list_.insert(std::make_pair(pid, retvalue));
  pthread_mutex_unlock(&mutex_);
}

int DownloaderScriptObject::TimerFunction(void* param) {
  pthread_mutex_lock(&mutex_);
  IntMap::iterator iter = download_result_list_.begin();
  while(iter != download_result_list_.end()) {
    NotifyFrontEnd(iter->first, iter->second);
    download_result_list_.erase(iter);
    iter = download_result_list_.begin();
  }
  pthread_mutex_unlock(&mutex_);
  return 1;
}
#endif

bool DownloaderScriptObject::Download(const NPVariant *args,
                                      uint32_t argCount,
                                      NPVariant *result) {
#ifdef OS_LINUX
  if (argCount != 2 || !NPVARIANT_IS_STRING(args[0]) ||
      !NPVARIANT_IS_STRING(args[1]))
    return false;

  const char* path = DownloadHelperScriptObject::download_path().c_str();
  std::string params(NPVARIANT_TO_STRING(args[0]).UTF8Characters,
                     NPVARIANT_TO_STRING(args[0]).UTF8Length);
  std::string url(NPVARIANT_TO_STRING(args[1]).UTF8Characters,
                  NPVARIANT_TO_STRING(args[1]).UTF8Length);

  if (params.find("$FILE_NAME") != std::string::npos) {
    GtkWidget *dialog = gtk_file_chooser_dialog_new(
        "Select Download Path", NULL,
        GTK_FILE_CHOOSER_ACTION_SAVE,
        GTK_STOCK_CANCEL, GTK_RESPONSE_CANCEL,
        GTK_STOCK_SAVE, GTK_RESPONSE_ACCEPT, NULL);

    const char* resource_name = strrchr(url.c_str(), '/');
    if (resource_name == NULL)
      resource_name = "";
    else
      resource_name = resource_name + 1;

    gtk_file_chooser_set_current_name(GTK_FILE_CHOOSER(dialog),
                                      resource_name);
    gtk_file_chooser_set_do_overwrite_confirmation(GTK_FILE_CHOOSER(dialog),
                                                   TRUE);
    gtk_window_set_position(GTK_WINDOW(dialog), GTK_WIN_POS_CENTER);
    gtk_file_chooser_set_current_folder(GTK_FILE_CHOOSER(dialog), path);
    gtk_window_set_keep_above(GTK_WINDOW(dialog), TRUE);

    char* ret_value = NULL;
    if (gtk_dialog_run(GTK_DIALOG(dialog)) == GTK_RESPONSE_ACCEPT) {
      char* folder = gtk_file_chooser_get_filename(GTK_FILE_CHOOSER(dialog));
      if (folder) {
        int len = strlen(folder);
        ret_value = (char*)NPN_MemAlloc(len + 1);
        memcpy(ret_value, folder, len);
        ret_value[len] = 0;
      }
      g_free(folder);
    }
    gtk_widget_destroy(dialog);
    if (ret_value == NULL)
      return true;

    __pid_t pid = fork();
    if (pid == 0) {
      int index = params.find("$DOWNLOAD_PATH");
      if (index != std::string::npos) {
        char* download_path = g_path_get_dirname(ret_value);
        params.replace(index, strlen("$DOWNLOAD_PATH"), download_path);
        g_free(download_path);
        index = params.find("$FILE_NAME");
        char* name = g_path_get_basename(ret_value);
        params.replace(index, strlen("$FILE_NAME"), name);
        g_free(name);
      } else {
        index = params.find("$FILE_NAME");
        params.replace(index, strlen("$FILE_NAME"), ret_value);
      }

      char* name = g_path_get_basename(ret_value);
      execlp("xterm", "xterm", "-title", name, "-e", params.c_str(), NULL);
      exit(0);
    } else if (pid != -1) {
      pthread_mutex_lock(&mutex_);
      char* download_path = g_path_get_dirname(ret_value);      
      download_process_list_.insert(std::make_pair(pid, download_path));
      g_free(download_path);
      pthread_mutex_unlock(&mutex_);
    }
  } else {
    if (fork() == 0) {
      execlp("sh", "sh", "-c", params.c_str(), NULL);
      exit(0);
    }
  }
#endif
  return true;
}

bool DownloaderScriptObject::DownloadAll(const NPVariant *args,
                                         uint32_t argCount,
                                         NPVariant *result) {
#ifdef OS_LINUX
  if (argCount != 2 || !NPVARIANT_IS_STRING(args[0]) ||
      !NPVARIANT_IS_STRING(args[1]))
    return false;

  const char* path = DownloadHelperScriptObject::download_path().c_str();
  std::string params(NPVARIANT_TO_STRING(args[0]).UTF8Characters,
                     NPVARIANT_TO_STRING(args[0]).UTF8Length);
  std::string url(NPVARIANT_TO_STRING(args[1]).UTF8Characters,
                  NPVARIANT_TO_STRING(args[1]).UTF8Length);


  GtkWidget *dialog = gtk_file_chooser_dialog_new(
      "Select Download Path", NULL,
      GTK_FILE_CHOOSER_ACTION_SELECT_FOLDER,
      GTK_STOCK_CANCEL, GTK_RESPONSE_CANCEL,
      GTK_STOCK_OK, GTK_RESPONSE_ACCEPT, NULL);

  gtk_window_set_position(GTK_WINDOW(dialog), GTK_WIN_POS_CENTER);
  gtk_file_chooser_set_current_folder(GTK_FILE_CHOOSER(dialog), path);
  gtk_window_set_keep_above(GTK_WINDOW(dialog), TRUE);

  char* ret_value = NULL;
  if (gtk_dialog_run(GTK_DIALOG(dialog)) == GTK_RESPONSE_ACCEPT) {
    char* folder = gtk_file_chooser_get_current_folder(
        GTK_FILE_CHOOSER(dialog));
    if (folder) {
      int len = strlen(folder);
      ret_value = (char*)NPN_MemAlloc(len + 1);
      memcpy(ret_value, folder, len);
      ret_value[len] = 0;
    }
    g_free(folder);
  }
  gtk_widget_destroy(dialog);
  if (ret_value == NULL)
    return true;

  __pid_t pid = fork();
  if (pid == 0) {
    int index = params.find("$DOWNLOAD_PATH");
    if (index != std::string::npos) {
      params.replace(index, strlen("$DOWNLOAD_PATH"), ret_value);
    }

    execlp("xterm", "xterm", "-title", url.c_str(), 
           "-e", params.c_str(), NULL);
    exit(0);
  } else if (pid != -1) {
    pthread_mutex_lock(&mutex_);
    download_process_list_.insert(std::make_pair(pid, ret_value));
    pthread_mutex_unlock(&mutex_);
  }
#endif
  return true;
}
