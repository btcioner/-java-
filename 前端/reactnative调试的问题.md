# 调react native时，会出现wacthman的错误
```
  echo 256 | sudo tee -a /proc/sys/fs/inotify/max_user_instances
echo 32768 | sudo tee -a /proc/sys/fs/inotify/max_queued_events
echo 65536 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
watchman shutdown-server
```

# 有时npm启动服务，调试端还是红色错误
```
  adb reverse tcp:8081 tcp:8081

```

# 有时打包失败出现*Unable to compute hash of /../AndroidStudioProjects/../classes.jar*
在在proguard-rules.pro文件末尾增加


```
-dontwarn java.nio.file.Files
-dontwarn java.nio.file.Path
-dontwarn java.nio.file.OpenOption
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**
-dontwarn butterknife.**
```


或者依据终端显示警告
```
  -dontwarn XXXXXXXXX
```
