#!/bin/bash

# 云服务器初始化脚本
# 在部署应用之前运行此脚本

set -e

echo "🛠️  开始初始化云服务器..."

# 更新系统
echo "📦 更新系统包..."
sudo apt update
sudo apt upgrade -y

# 安装基础工具
echo "📦 安装基础工具..."
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    net-tools \
    ufw

# 安装 Python 和 pip
echo "🐍 安装 Python3 和 pip..."
sudo apt install -y python3 python3-pip python3-venv

# 安装 Streamlit
echo "📦 安装 Streamlit..."
pip3 install streamlit

# 配置防火墙
echo "🔥 配置防火墙..."
sudo ufw allow ssh
sudo ufw allow 8500/tcp  # Streamlit 应用端口
sudo ufw --force enable

# 创建应用用户（可选）
echo "👤 创建应用用户..."
if ! id "llmuser" &>/dev/null; then
    sudo useradd -m -s /bin/bash llmuser
    echo "✅ 用户 llmuser 已创建"
    echo "⚠️  请设置密码: sudo passwd llmuser"
else
    echo "ℹ️  用户 llmuser 已存在"
fi

echo "✅ 服务器初始化完成！"
echo "📝 接下来可以运行 deploy.sh 部署应用"
echo "🔧 检查防火墙状态: sudo ufw status"
echo "🌐 应用将运行在端口: 8500"