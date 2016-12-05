from flask import Flask, render_template
from flask_sockets import Sockets
import logging
import redis
import uuid
import json

logger = logging.getLoggerClass()
app = Flask(__name__)
sockets = Sockets(app)
r = redis.StrictRedis(host='redis', port=6379, db=0)

@app.route('/start_game/<num_controllers>')
def start_game(num_controllers):
    game_id = uuid.uuid4()
    game_state = {}
    game_state['status'] = 'INIT'
    game_state['num_controllers'] = num_controllers
    r.set(game_id, json.dumps(game_state))
    logging.error('Initalized new game {0} ({1})'.format(game_id, game_state))
    return render_template('Game.html', game_id=str(game_id), num_controllers=num_controllers)

@sockets.route('/connect_controller/<game_id>/<controller_id>')
def connect_controller(ws, game_id, controller_id):
    if not r.exists(game_id):
        logging.error('Game {0} does not exist, could not connect.'.format(game_id))
        return 'Game {0} does not exist'.format(game_id)
   
    logging.error('Controller {0} connected to game {1}.'.format(controller_id, game_id))
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    while not ws.closed:
        message = ws.receive()
        if message is not None:
            logging.error('Controller {0} posted message {1} to game {2}'.format(controller_id, message, game_id))
            r.set(redis_key, message)

@app.route('/get_input/<game_id>/<controller_id>')
def get_input(game_id, controller_id):
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    return r.get(redis_key)

@app.route('/get_game_state/<game_id>')
def get_game_state(game_id):
    game_state = json.loads(r.get(game_id))
    num_controllers = int(game_state['num_controllers'])
    
    for controller_id in xrange(0, num_controllers):
        redis_key = '{0}/{1}'.format(game_id, controller_id)
        controller_name = 'controller {0}'.format(controller_id)
        game_state[controller_name] = r.get(redis_key)

    return json.dumps(game_state)
