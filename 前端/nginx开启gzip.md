## nginx开启gzip压缩功能#
```
http {
    proxy_cache_path  /var/cache/nginx levels=1:2 keys_zone=one:8m max_size=3000m inactive=600m;
    proxy_temp_path /var/tmp;
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    gzip on;
    gzip_comp_level 6;
    gzip_vary on;
    gzip_min_length  1000;
    gzip_proxied any;
    gzip_types text/plain text/html text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_buffers 16 8k;
 
    ssl_certificate /some/location/sillyfacesociety.com.bundle.crt;
    ssl_certificate_key /some/location/sillyfacesociety.com.key;
    ssl_protocols        SSLv3 TLSv1;
    ssl_ciphers HIGH:!aNULL:!MD5;

    upstream silly_face_society_upstream {
      server 127.0.0.1:61337;
      server 127.0.0.1:61338;
      keepalive 64;
    }

    server {
      listen 80;
      listen 443 ssl;

      server_name sillyfacesociety.com;
      return 301 $scheme://www.sillyfacesociety.com$request_uri;
    }

    server {
        listen 80;
        listen 443 ssl;

        server_name www.sillyfacesociety.com;

        error_page 502  /errors/502.html;

        location ~ ^/(images/|img/|javascript/|js/|css/|stylesheets/|flash/|media/|static/|robots.txt|humans.txt|favicon.ico) {
          root /usr/local/silly_face_society/node/public;
          access_log off;
          expires max;
        }

        location /errors {
          internal;
          alias /usr/local/silly_face_society/node/public/errors;
        }

        location / {
          proxy_redirect off;
          proxy_set_header   X-Real-IP            $remote_addr;
          proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
          proxy_set_header   X-Forwarded-Proto $scheme;
          proxy_set_header   Host                   $http_host;
          proxy_set_header   X-NginX-Proxy    true;
          proxy_set_header   Connection "";
          proxy_http_version 1.1;
          proxy_cache one;
          proxy_cache_key sfs$request_uri$scheme;
          proxy_pass         http://silly_face_society_upstream;
        }
    }
}
```

gzip开启
```
    gzip  on;
        gzip_comp_level 3;
        gzip_min_length 1024;
        gzip_types  text/plain text/css text/xml text/javascript application/javascript application/x-javascript application/json;
        gzip_disable "MSIE [4-6]\.";
        gzip_vary on;

```
