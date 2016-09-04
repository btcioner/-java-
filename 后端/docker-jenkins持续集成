# CentOS7.1使用Docker搭建基于Gitlab和Jenkins的Node.js持续集成环境

标签（空格分隔）： 未分类

---
![](http://7tsyut.com1.z0.glb.clouddn.com/1b19931164e4185f26aa8013a1c483ae.png)
在上一篇分享中，可以看出gulp能帮我们完成许多工作，但其中并不是所有的任务每个开发人员都用得到，诸如静态资源的打包、远程部署和版本归档等。那么可以把这些工作交给持续集成服务器来做，当开发人员push代码到gitlab的repoA后，触发jenkins执行构建操作，把构建后的代码push到gitlab的repoB，部署时直接从repoB clone最新的代码，如图所示：
![](http://7tsyut.com1.z0.glb.clouddn.com/ci_1.png)

# Prerequisites
[CentOS 7.1.1503](https://www.centos.org/)
[Docker Engine 1.8.3](https://www.docker.com/)
[Docker Compose 1.4.2](https://www.docker.com/)

# 1.安装CenOS7.1
由于公司发的笔记本实在太挫，平时一直在吃灰，现在终于派上用场了，用作本次实验的主机。到阿里云镜像仓库下载最新的[CentOS镜像](http://mirrors.aliyun.com/centos/7.1.1503/isos/x86_64/)，安装具体参考[How to Install CentOS 7 Step by Step with Screenshots](http://linoxide.com/how-tos/centos-7-step-by-step-screenshots/)

# 2.安装Docker
安装官方文档安装好[Docker](http://docs.docker.com/installation/centos/)和[Docker Compose](http://docs.docker.com/compose/install/)，然后启动Docker：
``` shell
sudo service docker start
```
结果启动失败：
![](http://7tsyut.com1.z0.glb.clouddn.com/fail.png)
并且CentOS防火墙弹出警告：
![](http://7tsyut.com1.z0.glb.clouddn.com/selinux.png)
google之，在[这里](https://github.com/docker/docker/issues/15498)找到了解决办法，`/etc/selinux/config`中设置`SELINUX=disabled`，然后重启系统，再启动docker，OK！

# 3.安装gitlab镜像
这里使用[sameersbn维护的版本](https://hub.docker.com/r/sameersbn/gitlab/)，目前最新版是8.1.2，执行
``` bash
docker pull sameersbn/gitlab
```
会默认下载最新版，也可指定版本下载，只需在命令后面加上tag：
``` bash
docker pull sameersbn/gitlab:8.1.2
```
如果墙内下载速度慢的话，可以使用[灵雀云的镜像仓库](https://hub.alauda.cn/)，只是更新有点慢：
``` bash
docker pull index.alauda.cn/sameersbn/gitlab
```
顺便说一句，本来打算写篇利用vps搭建shadowsocks的博客，毕竟自己前前后后花了两天时间来搭建、优化，但后来发现[这里](http://wuchong.me/blog/2015/02/02/shadowsocks-install-and-optimize/)基本把过程都写清楚了，也就不重复造轮子了，感兴趣的可以看看。
因为还要安装postgreSQL和redis，一个个pull太慢了，而且docker启动命令也很长，这时我们就可以发挥docker compose的作用了，参考sammersbn推荐的做法，执行：
``` bash
wget https://raw.githubusercontent.com/sameersbn/docker-gitlab/master/docker-compose.yml
```
下载后使用pwgen生成`GITLAB_SECRETS_DB_KEY_BASE`所需的key，

可定制其中的配置项，然后执行
``` bash

```
