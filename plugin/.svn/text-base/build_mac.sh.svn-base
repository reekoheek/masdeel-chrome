#!/bin/sh
mkdir -p download_assistant.plugin/Contents/MacOS
cp -f Info.plist download_assistant.plugin/Contents
g++ -framework Cocoa -DOS_MAC -DXP_MACOSX \
  -DWEBKIT_DARWIN_SDK -Wno-write-strings -lresolv -arch i386 -bundle \
  -isysroot /Developer/SDKs/MacOSX10.5.sdk -mmacosx-version-min=10.5 \
  -o download_assistant.plugin/Contents/MacOS/download_assistant \
  dll_entry.cc download_helper_plugin.cc download_helper_script_object.cc \
  log.cc npn_entry.cc npp_entry.cc plugin_base.cc plugin_factory.cc \
  script_object_base.cc script_object_factory.cc downloader_script_object.cc\
  mac_downloader_script_object.cc
