【实现总nginx方向代理到不同端口的docker】
首先要配置hosts
127.0.0.1 web1.a.com
127.0.0.1 web2.a.com


cd  /etc/nginx/sites-available 
sudo gedit default

#first vhost 
server {
    server_name web1.a.com;
    listen               80;

    location / {
      proxy_pass http://127.0.0.1:9001/;
      proxy_redirect default;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $http_connection;
    }

}
# seconde vhost
server {
        server_name web2.a.com;
        listen 80;

        location / {
                proxy_pass http://127.0.0.1:9002/;
                proxy_redirect default;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $http_connection;

        }

}
