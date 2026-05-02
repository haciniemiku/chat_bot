# API 密钥配置指南

## 重要安全提醒

**⚠️ 安全警告：不要使用他人的 API 密钥！**

- 每个用户应该使用自己的 API 密钥
- API 密钥包含计费信息，共享会导致费用问题
- 恶意使用可能导致您的账户被封禁
- 定期检查 API 使用情况

## 获取 DeepSeek API 密钥

### 步骤 1：注册 DeepSeek 账户
1. 访问 [DeepSeek 平台](https://platform.deepseek.com)
2. 注册新账户或登录现有账户
3. 完成身份验证（如果需要）

### 步骤 2：创建 API 密钥
1. 登录后进入 [API 密钥管理页面](https://platform.deepseek.com/api_keys)
2. 点击 "Create new secret key"
3. 为密钥命名（例如："chatbot-app"）
4. 复制生成的 API 密钥

### 步骤 3：检查 API 配额
1. 在 DeepSeek 控制台查看您的 API 使用配额
2. 了解免费额度和付费计划
3. 设置使用限制（推荐）

## 配置 API 密钥

### 方法 1：通过环境变量文件

编辑项目根目录下的 `.env` 文件：

```bash
# 进入项目目录
cd /opt/llm-chatbot

# 编辑环境变量文件
nano .env
```

填入您的 API 密钥：
```env
API_KEY=sk-your-actual-deepseek-api-key-here
BASE_URL=https://api.deepseek.com
MODEL_NAME=deepseek-chat
DEBUG_MODE=false
```

### 方法 2：通过系统环境变量

```bash
# 设置环境变量
export API_KEY="sk-your-actual-deepseek-api-key-here"
export BASE_URL="https://api.deepseek.com"
export MODEL_NAME="deepseek-chat"

# 启动应用
streamlit run app.py
```

### 方法 3：通过 Streamlit 密钥管理

如果您使用 Streamlit Cloud，可以在应用的 Secrets 管理中设置：

1. 进入 Streamlit Cloud 控制台
2. 选择您的应用
3. 进入 "Settings" → "Secrets"
4. 添加以下密钥：
```toml
API_KEY = "sk-your-actual-deepseek-api-key-here"
BASE_URL = "https://api.deepseek.com"
MODEL_NAME = "deepseek-chat"
```

## 安全最佳实践

### 🔐 密钥保护
- 永远不要将 API 密钥提交到版本控制系统
- 使用 `.gitignore` 保护 `.env` 文件
- 定期轮换 API 密钥
- 使用环境变量而不是硬编码

### 💰 费用管理
- 设置 API 使用限额
- 监控 API 调用次数
- 使用免费额度时注意限制
- 考虑为不同用户设置不同密钥

### 🛡️ 访问控制
- 限制 API 密钥的权限范围
- 使用 IP 白名单（如果支持）
- 定期审计 API 使用日志

## 故障排除

### 常见问题

**Q: API 调用失败，显示 "Invalid API Key"**
A: 检查 API 密钥是否正确，确保没有多余的空格或字符

**Q: 收到 "Rate Limit Exceeded" 错误**
A: API 调用频率过高，等待一段时间或升级配额

**Q: 如何检查 API 密钥是否有效？**
A: 可以使用简单的测试脚本验证密钥：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("API_KEY"),
    base_url="https://api.deepseek.com"
)

try:
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": "Hello"}],
        max_tokens=10
    )
    print("API 密钥有效！")
except Exception as e:
    print(f"API 密钥无效: {e}")
```

### 支持联系

- **DeepSeek 支持**: [帮助中心](https://platform.deepseek.com/help)
- **API 文档**: [DeepSeek API 文档](https://platform.deepseek.com/api-docs)
- **计费问题**: [计费页面](https://platform.deepseek.com/billing)

## 部署注意事项

### 多用户部署
如果您计划为多个用户提供服务，建议：

1. **每个用户独立部署**：每个用户有自己的服务器实例
2. **API 网关**：实现一个 API 网关来管理多个密钥
3. **用户认证**：添加用户登录系统，关联各自的 API 密钥

### 生产环境安全
- 使用 HTTPS 加密传输
- 配置防火墙规则
- 定期更新依赖包
- 设置监控和告警

---

**记住：安全第一！妥善保管您的 API 密钥。**