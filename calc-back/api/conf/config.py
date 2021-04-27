import os

class Config(object):
    """
    Common configurations
    """

    FRONT_URL = 'https://calcfront.azurewebsites.net'
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024
    SECRET_KEY = 'my_precious'
    SECURITY_PASSWORD_SALT = 'my_precious_two'
    BCRYPT_LOG_ROUNDS = 13
    WTF_CSRF_ENABLED = True
    MAIL_SERVER = 'smtp-mail.outlook.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'webcommerce1021@hotmail.com'
    MAIL_PASSWORD = 'guru1021!'
    MAIL_DEFAULT_SENDER = 'webcommerce1021@hotmail.com'


class DevelopmentConfig(Config):
    """
    Development configurations
    """
    # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/rxcitmes_calc'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://rxcitmes_calc:Guru1021!@108.167.181.160/rxcitmes_calc'
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_POOL_RECYCLE = 90


class ProductionConfig(Config):
    """
    Production configurations
    """
    # Digital Ocean
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://rxcitmes_calc:Guru1021!@108.167.181.160/rxcitmes_calc'
    DEBUG = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_POOL_RECYCLE = 90

app_config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
