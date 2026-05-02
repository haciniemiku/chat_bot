#!/bin/bash

# LLM Chatbot 部署脚本
# 适用于 Ubuntu/CentOS 云服务器

set -e

echo "🚀 开始部署 LLM Chatbot..."

# 检查 Python 是否安装
if ! command -v python3 &> /dev/null; then
    echo "📦 安装 Python3..."
    sudo apt update
    sudo apt install -y python3 python3-pip
fi

# 检查 Git 是否安装
if ! command -v git &> /dev/null; then
    echo "📦 安装 Git..."
    sudo apt install -y git
fi

# 创建项目目录
PROJECT_DIR="/opt/llm-chatbot"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# 克隆或更新代码
echo "📥 下载代码..."
if [ -d "$PROJECT_DIR/.git" ]; then
    cd $PROJECT_DIR
    git pull origin main
else
    git clone https://github.com/YOUR_USERNAME/llm-chatbot.git $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 安装依赖
echo "📦 安装 Python 依赖..."
pip3 install -r requirements.txt

# 创建环境变量文件
echo "🔧 配置环境变量..."
if [ ! -f "$PROJECT_DIR/.env" ]; then
    cat > $PROJECT_DIR/.env << EOF
API_KEY=your_api_key_here
BASE_URL=https://api.deepseek.com
MODEL_NAME=deepseek-chat
DEBUG_MODE=false
EOF
    echo "⚠️  请编辑 $PROJECT_DIR/.env 文件，填入您的 API 密钥"
fi

# 创建 systemd 服务文件
echo "🔧 创建系统服务..."
sudo tee /etc/systemd/system/llm-chatbot.service > /dev/null << EOF
[Unit]
Description=LLM Chatbot Streamlit App
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR
Environment=PATH=/usr/bin:/usr/local/bin
ExecStart=/usr/bin/streamlit run app.py --server.port 8500 --server.headless true
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 重新加载 systemd 并启动服务
echo "🚀 启动服务..."
sudo systemctl daemon-reload
sudo systemctl enable llm-chatbot
sudo systemctl start llm-chatbot

# 检查服务状态
echo "📊 检查服务状态..."
sleep 3
sudo systemctl status llm-chatbot --no-pager

echo "✅ 部署完成！"
echo "🌐 应用运行在: http://your-server-ip:8500"
echo "📝 编辑配置文件: $PROJECT_DIR/.env"
echo "🔧 管理服务: sudo systemctl [start|stop|restart|status] llm-chatbot"