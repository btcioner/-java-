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
