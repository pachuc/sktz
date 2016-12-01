from flask import Flask
from flask_sockets import Sockets
import logging


logger = logging.getLoggerClass()
app = Flask(__name__)
sockets = Sockets(app)

@sockets.route('/controller/<controller_id>')
def controller(ws, controller_id):
    """
    This countroller route will open a persitent websocket, 
    and write the messages of the websocket to redis.
    """
    logging.error('Controller {0} connected.'.format(controller_id))
    logging.error('Web socket initialized')
    while not ws.closed:
        message = ws.receive()
        logging.error('Controller {0} posted message {1}'.format(controller_id, message))
