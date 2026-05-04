# LLM Chatbot 部署档案

## 服务器信息

项目目录：

/opt/chat_bot

公网访问：

http://8.148.71.147:3000

## 服务信息

后端服务：

llm-chatbot

前端服务：

llm-chatbot-frontend

## 端口

前端 Next.js：

3000

后端 FastAPI：

8000

## 常用命令

查看后端状态：

sudo systemctl status llm-chatbot

查看前端状态：

sudo systemctl status llm-chatbot-frontend

重启后端：

sudo systemctl restart llm-chatbot

重启前端：

sudo systemctl restart llm-chatbot-frontend

查看后端日志：

sudo journalctl -u llm-chatbot -n 100 --no-pager

查看前端日志：

sudo journalctl -u llm-chatbot-frontend -n 100 --no-pager

查看端口：

sudo ss -lntp | grep -E "3000|8000"
