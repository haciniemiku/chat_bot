import os
import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("API_KEY"),
    base_url=os.getenv("BASE_URL")
)

MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4o-mini")
DEBUG_MODE = os.getenv("DEBUG_MODE", "false").lower() == "true"

st.set_page_config(page_title="LLM Chatbot", page_icon="🤖")

st.title("🤖 LLM 对话机器人")

if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": "你是一个友好、简洁的AI助手。"}
    ]

for msg in st.session_state.messages:
    if msg["role"] != "system":
        with st.chat_message(msg["role"]):
            st.write(msg["content"])

user_input = st.chat_input("请输入你的问题...")

if user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})

    with st.chat_message("user"):
        st.write(user_input)

    with st.chat_message("assistant"):
        with st.spinner("思考中..."):
            try:
                response = client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=st.session_state.messages,
                    temperature=0.7
                )
                if DEBUG_MODE:
                    with st.sidebar:
                        st.subheader("API调试")

                        st.write("完整返回：")
                        st.json(response.model_dump())

                        st.write("Token使用：")
                        st.write(response.usage)

                        st.write("结束原因：")
                        st.write(response.choices[0].finish_reason)
                answer = response.choices[0].message.content
                st.write(answer)

                st.session_state.messages.append({
                    "role": "assistant",
                    "content": answer
                })

            except Exception as e:
                st.error(f"调用失败：{e}")