# 构建镜像的基础源镜像
FROM hub.c.163.com/nce2/nodejs:0.12.2
 
# Create app directory
# 用于在Image里创建一个文件夹并用来保存我们的代码
RUN mkdir -p /home/Service
# 将我们创建的文件夹做为工作目录
WORKDIR /home/Service
 
# Bundle app source
# 把本机当前目录下的所有文件拷贝到Image的/home/Service文件夹下
COPY . /home/Service
# 使用npm 安装我们的app据需要的所有依赖
RUN npm install
 
EXPOSE 8888
CMD [ "npm", "start" ]