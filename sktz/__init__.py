from flask import Flask, render_template
from flask_sockets import Sockets
from functools import wraps
import logging
import redis
import uuid
import json
import string, random

logger = logging.getLoggerClass()
app = Flask(__name__)
sockets = Sockets(app)
r = redis.StrictRedis(host='redis', port=6379, db=0)

def _getGame(game_id):
    return json.loads(r.get(game_id))
def _getController(game_id, controller_id):
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    return json.loads(r.get(redis_key))
def _setGame(game_id, game_state):
    r.set(game_id, json.dumps(game_state))
def _setController(game_id, controller_id, controller_state):
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    r.set(redis_key, json.dumps(controller_state))
def _gameExists(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        game_id = kwargs['game_id']
        if r.exists(game_id):
            return f(*args, **kwargs)
        else:
            logging.error('Game {0} does not exist'.format(game_id))
    return decorated_function
def _idGenerator(size=5, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

@app.route('/start_game/<num_controllers>')
def start_game(num_controllers):
    game_id = _idGenerator()
    game_state = {}
    game_state['status'] = 'INIT'
    game_state['num_controllers'] = int(num_controllers)
    controller_state = {}
    controller_state['status'] = 'DISCONNECTED'
    controller_state['input'] = {}
    for controller_id in xrange(0, int(num_controllers)):
        _setController(game_id, controller_id, controller_state)
    _setGame(game_id, game_state)
    logging.error('Initalized new game {0} ({1})'.format(game_id, game_state))
    return render_template('Game.html', game_id=str(game_id), num_controllers=num_controllers)

@sockets.route('/connect_controller/<game_id>/<controller_id>')
@_gameExists
def connect_controller(ws, game_id, controller_id):
    logging.error('Controller {0} connected to game {1}.'.format(controller_id, game_id))
    controller_state = _getController(game_id, controller_id)
    if controller_state['status'] == 'CONNECTED':
        logging.error('Cannot connect to already connected controller {0} on game {1}'.format(controller_id, game_id))
        return None
    controller_state['status'] = 'CONNECTED'
    while not ws.closed:
        message = ws.receive()
        if message is not None:
            controller_state['input'] = message
        _setController(game_id, controller_id, controller_state)
    controller_state['status'] = 'DISCONNECTED'
    _setController(game_id, controller_id, controller_state)

@app.route('/get_game_state/<game_id>')
@_gameExists
def get_game_state(game_id):
    game_state = _getGame(game_id)
    num_controllers = game_state['num_controllers']
    
    for controller_id in xrange(0, num_controllers):
        controller_name = 'controller{0}'.format(controller_id)
        game_state[controller_name] = _getController(game_id, controller_id)

    return json.dumps(game_state)
