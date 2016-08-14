
docker run -d -P -p 80:80 -v /data/dockerweb:/usr/share/nginx/html -v /data/dockerconfig/nginx:/etc/nginx/conf.d --name duser nginx

配置本地文件指定到了对应docker容器
