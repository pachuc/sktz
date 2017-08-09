from sktz.utils import _gameExists, _setGame, _getGame, _setController, _getController, _idGenerator, _assembleGameState
from sktz import settings
from flask import Blueprint, render_template, redirect, url_for, request
import logging
import json
import time

html = Blueprint('html', __name__)
ws = Blueprint('ws', __name__)
server_url = settings['SERVER_URL']

@html.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        num_controllers = request.form.get('num_controllers')
        game = request.form.get('Game')
        if game and num_controllers:
            logging.error('Game and controllers : {0}, {1}'.format(game, num_controllers))
            return redirect(url_for('html.start_game', game_name=game, num_controllers=num_controllers))
    else:
        logging.error('Render template with no args.')
        return render_template('index.html')

@html.route('/start_game/<game_name>/<num_controllers>')
def start_game(game_name, num_controllers):
    game_id = _idGenerator()
    game_state = {}
    game_state['status'] = 'INIT'
    game_state['name'] = game_name
    game_state['num_controllers'] = int(num_controllers)
    controller_state = {}
    controller_state['status'] = 'DISCONNECTED'
    controller_state['input'] = {}
    for controller_id in xrange(0, int(num_controllers)):
        _setController(game_id, controller_id, controller_state)
    _setGame(game_id, game_state)
    logging.error('Initalized new {2} {0} ({1})'.format(game_id, game_state, game_name))
    return render_template('Game.html', game_id=str(game_id), num_controllers=num_controllers, 
        game_name=game_name, server_url=server_url)

@ws.route('/connect_controller/<game_id>/<controller_id>')
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
            message = json.loads(message)
            logging.error('Controller {0} on game {1} posted {2}'.format(controller_id, game_id, message))
            controller_state['input'] = message
        _setController(game_id, controller_id, controller_state)
    logging.error('Correctly disconnected the controller')
    controller_state['status'] = 'DISCONNECTED'
    _setController(game_id, controller_id, controller_state)

@html.route('/get_game_state/<game_id>')
@_gameExists
def get_game_state(game_id):
    return _assembleGameState(game_id)

@ws.route('/get_game_state_persist/<game_id>')
@_gameExists
def get_game_state_persist(ws, game_id):
    while not ws.closed:
        message = _assembleGameState(game_id)
        ws.send(message)
        time.sleep(1)

    
