# 先安装postgressql docker镜像#
`sudo docker run -d --name postgressql postgres`
# 然后gogs镜像与postgresQL链接link#
`sudo docker run --name=gogs --link postgressql:alias -d -p 10022:22 -p 10080:3000 -v /var/gogs:/data gogs/gogs`