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

@sockets.route('/echo')
def echo_socket(ws):
    logging.error('Web socket intialized')
    while not ws.closed:
        message = ws.receive()
        ws.send(message)


@app.route('/')
def hello():
    logging.error('This is a test!')
    return 'Hello World!'


if __name__ == "__main__":
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()
