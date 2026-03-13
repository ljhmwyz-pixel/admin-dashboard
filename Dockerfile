FROM nginx:alpine

# 删除默认配置
RUN rm -rf /usr/share/nginx/html/*

# 复制构建产物
COPY dist/ /usr/share/nginx/html/

# 复制 nginx 配置（如果有自定义配置）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
