nativescript打包安卓程序
=========
+ 1.生成安卓密钥
```
 keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```
+ 2.执行命令生成ap
```
 tns build android --release --key-store-path /home/ralap/my-release-key.keystore --key-store-password 123456 --key-store-alias alias_name  --key-store-alias-password 123456
```



react native打包
========


+ 1.在build.gradle加入
 ```
         signingConfigs {
            release {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
 ```
 
 ```
     buildTypes {
        release {
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            signingConfig signingConfigs.release
        }
    }
 ```
 
 + 2.在gradlew.properties加入
 ```
    MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
    MYAPP_RELEASE_KEY_ALIAS=alias_name
    MYAPP_RELEASE_STORE_PASSWORD=123456
    MYAPP_RELEASE_KEY_PASSWORD=123456
 ```
 + 3.
 ```
   ./gradlew assembleRelease

    
 ```
 3、打包应用
在 android/app/src/main/ 目录下创建 assets 目录
项目根目录下，执行命令 react-native bundle --platform android --dev false --entry-file index.android.js \ --bundle-output android/app/src/main/assets/index.android.bundle \ --assets-dest android/app/src/main/res/，完成后在 下生成 文件
