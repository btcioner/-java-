



安装步骤：

使用管理员帐号登录ubuntu 14.04系统，保证该管理有root权限，或者可以执行sudo命令。
检查curl包有没有安装。
$ which curl
如果curl没有安装的话，更新apt源之后，安装curl包。
$ sudo apt-get update $ sudo apt-get install curl
获得最新的docker安装包。
$ curl -sSL https://get.docker.com/ | sh 
shell会提示你输入sudo的密码，然后开始执行安装过程。
确认Docker是否安装成功。
$ sudo docker run hello-world
这个命令会下载一个测试用的镜像并启动一个容器运行它。

----------------docker 命令--------------
检测是否在运行
status docker
停止或启动
sudo stop docker
sudo start docker

查看是否存在
docker info

运行  -i 保存容器中STDIN是开启的  -t 分配一个伪tty终端，这样就可以进行交互式shell，而不是运行后台服务的容器
   ubuntu告诉docker基于什么镜像来创建容器
sudo docker run -i -t ubuntu /bin/bash

mac:  docker run -it ubuntu bash

登录docker后，可以用
hostname   查看容器的id
cat /etc/hosts  可以查看id和ip

列出所有容器
docker ps  -a
删除容器
docker rm 2630f2b85a17

命名容器
docker run --name my_container -i -t ubuntu bash

运行后就删除 —rm，退出后就删除自己了
docker run --rm --name once -i -t ubuntu bash

查看镜像
docker images

运行容器start stop restart
docker start my_container

运行容器，想要进行交互怎么办？可以重新附着
不过附着exit退出后，容器就停止运行了
docker attach my_container

如果想要长期运行的容器，可以创建守护式容器 -d 将容器放后台运行
docker run --name daemon_power -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"

我们可以查看容器的命令
docker logs daemon_power
加上时间戳，可以ctrl + c退出
docker logs -ft daemon_power

在容器内部运行进程
docker exec -d daemon_power touch /etc/new_config.file
docker exec -t -i daemon_power /bin/bash

查看最后x个容器
docker ps -n x

自动重启容器
docker run --restart=always --name daemon_power -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"
自动重启5次
docker run --restart=on-failure:5 --name daemon_power -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"

查看容器具体信息 
docker inspect daemon_power
可以加format
docker inspect --format '{{.NetworkSettings.IPAddress}}' daemon_power
也加同时查看多个容器，名称用空格隔开即可


删除所有容器(未测试)
docker rm 'docker ps -a -q'


获取镜像
docker pull ubuntu
可以加上:表示版本号
docker pull ubuntu:14.04

在线查找镜像
docker search ubuntu


删除镜像
docker rmi image_name

登录docker hub ，登录后信息将会保存到 $HOME/.docker/config文件中(mac)
docker login

使用Dockerfile创建镜像
$ mkdir static_web
$ cd static_web
$ nano Dockerfile
文件内容如下
=====start file=======
# Version: 0.0.1
# 指定ubuntu:14.04为基础
FROM ubuntu:14.0
MAINTAINER power "power@soesoft.com.cn"
RUN apt-get update
# 安装nginx run指令会在shell里用命令包装器/bin/sh -c 来执行，如果在一个不支持shell的平台上运行可以使用exec格式的run指令
# RUN ["apt-get", " install", "-y","nginx" ]
RUN apt-get install -y nginx
RUN echo 'Hi, Hello Docker' > /usr/share/nginx/html/index.html
# 出于安全考虑,docker并不会自动打开商品，需求自己指定
EXPOSE 80
======end file======

构建镜像，不要忘了最后一个小点哦
$ docker build -t="soesoft/static_web" .

构建的时候也可以加上标签，如果不放，将会自动设置一个lastest标签
$ docker build -t="soesoft/static_web:v1” .

也可以使用git路径，假设以下路径存在Dockerfile文件
$ docker build -t="soesoft/static_web” git@github.com:/soesoft/docker-static_web

如果构建的过程中有失败的，也会产生一个镜像，你可以在这个镜像中开始执行调度下一条语句，直到成功，然后开始重新开头构建

查看构建镜像的每一层
docker history your_image_id

运行刚构建好的镜像  -d 代表以分离(detached)的方式在后台运行   nginx -g “daemon off;”  将以前台运行的方式启动nginx，要不然会马上退出  -p 用于控制docker运行时应该公开哪些端口
docker run -d -p 80 --name static_web soesoft/static_web:v1 nginx -g "daemon off;”
可以查看到80的端口被映身到了宿主机的哪个端口，0.0.0.0:32771->80/tcp  表示是80端口映射到宿主机的32771
docker ps -l 
也可以指定映身端口
-p 8090:80  前面的代表宿主机端口，后面的80表示容器公开的端口
还可以指定ip地址
-p 127.0.0.1:8090:80
也可以只指定ip，端口随机分配
-p 127.0.0.1::80
还有一个更方便的方式，加入-P，会随机公开所有EXPOSE的端口
测试服务是否启动
$ curl 127.0.0.1:32771    (mac中ip地址为machine的地址，如192.186.99.100)

CDM指令
docker run -it soesoft/static_web:v1 /bin/true 
相当于在Dockerfile中加入
CMD [“/bin/true”]
也可以为要运行的命令指定参数
CMD [“/bin/bash”, “-l”]
注：docker run 可以覆盖CMD指令

假设我们的Dockerfile文件代码中有
CDM [“/bin/bash”]
在启动一个容器的时候，会自动运行
docker run -it soesoft/static_web:v1
此时如果自己加入run 命令
docker run -it soesoft/static_web:v1 /bin/ps
则只会运行ps命令

注：一个Dockerfile中只能有一个CMD命令，如果有多个，只有最后一条会被执行


ENTRYPOINT
ENTRYPOINT ["/usr/sbin/nginx"]
可以把参数传递给nginx
docker run -t -i soesoft/static_web:v1 -g "daemon off;"
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
ENTRYPOINT 指令不会被run覆盖

可以组合CMD和 ENTRYPOINT完成一些工作
ENTRYPOINT ["/usr/sbin/nginx"]
CMD ["-h"]
此时当我们启动一个容器时，任何在命令行中指定的参数都会被传递给nginx守护进程，如可以指定 -g "daemon off;"
如果不传递任何参数，则会使用 CMD 中的 -h  方式启动


WORKDIR 用来指定在从镜像创建一个新容器时，在容器内部设置一个工作目录， ENTRYPOINT CMD 会在这个目录下执行
有点类似cd 命令
======
WORKDIR /opt/webapp/db
RUN bundle install
WORKDIR /opt/webapp
ENTRYPOINT [ "rackup" ]
======
可以通过        -w 标志在运行时覆盖工作目录
docker run -ti -w /var/log ubuntu pwd
会出来 /var/log


ENV 用来在镜像构建过程中设置环境变量
ENV RVM_PATH /home/rvm/
这个环境变更就可以在RUN 中使用
RUN gen install unicorn
该指令会执行下面的命令
RVM_PATH=/home/rvm/ gen install unicorn

我们也能在其他指令中直接使用这些环境变量
EVN TARGET_DIR /opt/app
WORKDIR $TARGET_DIR

这些环境变量会被持久保存到从我们镜像创建的任何容器中，在容器中可以用
evn 查看

也可以使用docker run命令行的 -e 来传递环境变量，这些变量将只会在运行时有效
docker run -ti -e "WEB_PORT=8080" ubuntu env 



USER 用来指定该镜像会以什么样的用户去运行
USER nginx
docker run -u 也起到同样的效果



VOLUME 用来向基于镜像创建的容器添加卷
VOLUME ["/opt/project"]
也可以指定多个卷
VOLUME ["/opt/project", "/data"]



ADD 用来将构建环境下的文件和目录复制到镜像中
ADD software.lic /opt/application/softwar.lic
如果目标不地址以/结尾，那么就认为源位置指向的是一个目录
也可以使用http格式的路径
ADD http://www.soesoft.com.cn/lib.zip /root/word.zip
如果像归档文件指向文件夹，会自动解压
ADD lib.tar.gz /var/www/word/



COPY  也是复制文件，不过不会自动解压



ONBUILD   当一件镜像被用做其他镜像的基础镜像时，该镜像中的触发器将会被执行 注：孙镜像时不会触发
ONBUILD ADD . /app/src
ONBUILD RUN cd /app/src && make 



推送镜像到远程仓库
doker push soesoft/static_web



-v 使用卷，把当前路径映射到容器中
卷可以在容器中共享，即使容器停止，卷里的内容依然存在，直到所有容器都删除
$ cd $HOME
$ mkdir site
$ cd site
$ echo "hello docker web" > index.html
$ docker run -d -P -v $HOME/site:/usr/share/nginx/html --name mysite nginx
$ docker port mysite 
查看端口后可以浏览了

可以加上rw或ro来指定目录的读写状态
docker run -d -P -v $HOME/site:/usr/share/nginx/html:ro --name mysite nginx

注：在mac下要使用postgresql -v指令时，需求登录到docker-machine ssh default 使用虚拟机中的文件夹，是因为文件夹权限的问题

包含mysite中的卷
docker run -d -P --volumes-from mysite nginx 


容器之间的连接 --link 容器名:别名
这样就可以在容器内用别名访问了，容器的端口可以不对宿主机公开，这样就建立了一个很安全的模型
多个容器可以同时连接
就算是容器重启了，ip变了，别名也照样可以使用
在 /etc/hosts 中可以看到别名和ip 对应的定义
docker run -v /Users/power/pgdata:/var/lib/postgresql/data -P --name mypg -e POSTGRES_PASSWORD=soesoft -d postgres
docker run -it -v /Users/power/source/soecrm/crm-rest/build/libs:/home -p 192.168.99.100:8084:8080 --name crmrest --link mypg:db java:8  java -jar /home/crm-rest.war  --spring.datasource.url=jdbc:postgresql://db:5432/soexq





docker run -d -P -p 32788:80 -v /home/soesoftxjb/www/auser:/usr/share/nginx/html --name duser nginx

配置本地文件指定到了对应docker容器

docker run -it -v /Users/power/source/crm-rest/build/libs:/home -p 192.168.99.100:8084:8080 --name crmrest java:8  java -jar /home/crm-rest.war  --spring.datasource.url=jdbc:postgresql://192.168.1.100:5432/soexq
sudo docker run -it -v ~/codebase/study-spring/Spring-boot-Demo/build/libs:/usr/mou/libs -p 127.0.0.1:8084:9001 --name e8084 java:8  java -jar /usr/mou/libs/gs-actuator-service-0.1.0.jar


——————boot2docker------------------
在 MacOS 上安装docker时需要进行 boot2docker init

但因网络原因，安装很有可能失败。其实这个命令会去访问这个链接。打开这个链接，搜索你想要的 boot2docker iso 版本，然后下载下来。目前最新的版本1.9.1的下载地址是：

https://github.com/boot2docker/b ... 9.1/boot2docker.iso
下载后，把它放在~/.boot2docker 目录即可。

这时运行 boot2docker init 就可以了。





——————

docker-machine ls

docker-machine ssh default





dockerhub帐号 soesoft  956497829   654321

github帐号 soesoftcn  956497829   soe1234

去除掉sudo

在Ubuntu下，在执行Docker时，每次都要输入sudo，同时输入密码，很累人的，这里微调一下，把当前用户执行权限添加到相应的docker用户组里面。

# 添加一个新的docker用户组
sudo groupadd docker
# 添加当前用户到docker用户组里，注意这里的yongboy为ubuntu server登录用户名
sudo gpasswd -a yongboy docker
# 重启Docker后台监护进程
sudo service docker restart
# 重启之后，尝试一下，是否生效
docker version
#若还未生效，则系统重启，则生效
sudo reboot


--------------------------------------
重置环境
$ docker-machine restart default      # Restart the environment
$ eval $(docker-machine env default)  # Refresh your environment settings
