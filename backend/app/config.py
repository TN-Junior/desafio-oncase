import os
from dotenv import load_dotenv
from urllib.parse import quote_plus


load_dotenv()

class Config:
    
    db_password = quote_plus(os.getenv('DB_PASSWORD')) 

    SQLALCHEMY_DATABASE_URI = (
        f"mysql://{os.getenv('DB_USER')}:{db_password}"
        f"@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False



class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test_db.sqlite'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
