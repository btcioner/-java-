# git创建初始空库

```
  sudo apt-get install git
  sudo adduser git
```

# 第二部进入git用户目录

```
  cd /git
  ssh-keygen 
```
> 生成ssh密钥用来远程推送
> 把本地的id_rsa.pub 中的密钥拷贝到/home/git/.ssh/authorized_keys
