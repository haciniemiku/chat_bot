# LLM Chatbot 部署指南

## 项目概述
基于 Streamlit 和 DeepSeek API 的 LLM 对话机器人应用。

## 部署流程

### 第一步：上传代码到 GitHub

1. **在 GitHub 创建仓库**
   - 登录 GitHub
   - 点击 "New repository"
   - 仓库名: `llm-chatbot`
   - 描述: "基于 Streamlit 和 DeepSeek API 的 LLM 对话机器人"
   - 选择 Public 或 Private
   - **不要**初始化 README、.gitignore 或 license

2. **推送代码到 GitHub**
   ```bash
   # 添加远程仓库（替换 YOUR_USERNAME）
   git remote add origin https://github.com/YOUR_USERNAME/llm-chatbot.git
   
   # 重命名主分支（如果需要）
   git branch -M main
   
   # 推送代码
   git push -u origin main
   ```

### 第二步：准备云服务器

#### 服务器要求
- Ubuntu 20.04+ 或 CentOS 8+
- 至少 1GB RAM
- 公网 IP 地址

#### 初始化服务器
```bash
# 下载初始化脚本
wget https://raw.githubusercontent.com/YOUR_USERNAME/llm-chatbot/main/setup-server.sh

# 赋予执行权限
chmod +x setup-server.sh

# 运行初始化脚本
sudo ./setup-server.sh
```

### 第三步：部署应用

```bash
# 下载部署脚本
wget https://raw.githubusercontent.com/YOUR_USERNAME/llm-chatbot/main/deploy.sh

# 赋予执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

### 第四步：配置环境变量

编辑环境配置文件：
```bash
nano /opt/llm-chatbot/.env
```

填入以下内容：
```env
API_KEY=sk-your-deepseek-api-key-here
BASE_URL=https://api.deepseek.com
MODEL_NAME=deepseek-chat
DEBUG_MODE=false
```

### 第五步：重启服务

```bash
# 重启服务使配置生效
sudo systemctl restart llm-chatbot

# 检查服务状态
sudo systemctl status llm-chatbot
```

## 管理命令

### 服务管理
```bash
# 启动服务
sudo systemctl start llm-chatbot

# 停止服务
sudo systemctl stop llm-chatbot

# 重启服务
sudo systemctl restart llm-chatbot

# 查看服务状态
sudo systemctl status llm-chatbot

# 查看服务日志
sudo journalctl -u llm-chatbot -f
```

### 应用更新
```bash
# 进入项目目录
cd /opt/llm-chatbot

# 拉取最新代码
git pull origin main

# 重启服务
sudo systemctl restart llm-chatbot
```

## 安全配置

### 防火墙设置
```bash
# 查看防火墙状态
sudo ufw status

# 开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 8500  # Streamlit 应用
```

### 使用 Nginx 反向代理（推荐）
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8500;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep :8500
   
   # 杀死占用进程
   sudo kill -9 <PID>
   ```

2. **服务启动失败**
   ```bash
   # 查看详细日志
   sudo journalctl -u llm-chatbot -n 50
   ```

3. **API 调用失败**
   - 检查 `.env` 文件中的 API 密钥
   - 确认网络连接正常
   - 查看 DeepSeek API 状态

### 日志查看
```bash
# 实时查看应用日志
tail -f /var/log/syslog | grep llm-chatbot

# 查看系统服务日志
sudo journalctl -u llm-chatbot -f
```

## 备份与恢复

### 备份配置
```bash
# 备份环境配置
sudo cp /opt/llm-chatbot/.env /backup/llm-chatbot-env-backup

# 备份系统服务配置
sudo cp /etc/systemd/system/llm-chatbot.service /backup/
```

### 恢复部署
```bash
# 重新运行部署脚本
cd /opt/llm-chatbot
./deploy.sh
```

## 联系方式

如有问题，请提交 GitHub Issue 或联系维护者。