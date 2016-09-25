## 无法安装temeview
### 其实amd64那个包安装是有问题的,直接安装i386的包
[下载链接](http://www.teamviewer.com/en/download/linux.aspx)
```
  cd ~/Downloads/
  sudo dpkg -i teamviewer_linux.deb
  sudo apt-get -f install
  
```
