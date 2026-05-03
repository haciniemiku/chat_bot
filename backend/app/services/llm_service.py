from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    api_key=settings.API_KEY,
    base_url=settings.BASE_URL
)

def get_openai_stream(message: str):
    stream = client.chat.completions.create(
        model=settings.MODEL_NAME,
        messages=[
            {"role": "system", "content": "你是一个友好、简洁的AI助手。"},
            {"role": "user", "content": message},
        ],
        temperature=0.7,
        max_tokens=1000,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


def get_openai_response(message: str) -> str:
    response = client.chat.completions.create(
        model=settings.MODEL_NAME,
        messages=[
            {"role": "system", "content": "你是一个友好、简洁的AI助手。"},
            {"role": "user", "content": message}
        ],
        temperature=0.7,
        max_tokens=1000
    )

    return response.choices[0].message.content