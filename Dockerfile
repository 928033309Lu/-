FROM nginx
#作者信息 测试
MAINTAINER unclelong "chenlong35429@goldwind.com.cn"
RUN mkdir -p /usr/share/nginx/wind-resource/dist
ADD nginx.conf /etc/nginx/conf.d/default.conf
ADD dist/ /usr/share/nginx/html/
RUN chmod 777 -R /usr/share/nginx/html
EXPOSE 80
