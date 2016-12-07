from flask import Flask, Config
from flask_sockets import Sockets
import os
from redis import from_url

DEFAULT_CONFIG = 'settings.py'
class Settings(Config):
    def __init__(self):
        here = os.path.dirname(os.path.abspath(__file__))
        super(Settings, self).__init__(here)
        config = os.environ.get('SKTZ_CONFIG', DEFAULT_CONFIG)
        self.from_pyfile(config)
        #self.setup_logging()
    def setup_logging(self):
        from logging.config import dictConfig
        dictConfig(self.get('LOGGING', {'version':1}))

settings = Settings()
redis = from_url(settings['REDIS_URL'])
app = Flask(__name__)
app.config.update(settings)
#stop flask app initialization from overriding our logger settings
#app.logger
#settings.setup_logging()
sockets = Sockets(app)
#register our views
from sktz.views import html, ws
app.register_blueprint(html)
sockets.register_blueprint(ws)
