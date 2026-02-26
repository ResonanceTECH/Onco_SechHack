from pathlib import Path

from pydantic import ConfigDict
from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).resolve().parent
BACKEND_ENV_PATH = BASE_DIR.parent / "backend" / ".env"


class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=str(BACKEND_ENV_PATH),
        env_file_encoding="utf-8",
    )

    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASS: str
    DB_NAME: str

    @property
    def SYNC_DB_URL(self) -> str:
        return (
            f"postgresql://{self.DB_USER}:{self.DB_PASS}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


settings = Settings()

