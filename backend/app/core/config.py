from pydantic_settings import BaseSettings,SettingsConfigDict


class Settings(BaseSettings):
    model_config=SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )
    API_KEY: str
    BASE_URL: str | None = None
    MODEL_NAME: str = "deepseek-chat"
    DEBUG_MODE: bool = False
    APP_PASSWORD: str | None = None

    


settings = Settings()