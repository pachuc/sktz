from sktz.utils import _gameExists, _setGame, _getGame, _setController, _getController, _idGenerator, _assembleGameState
from flask import Blueprint, render_template
import logging
import json

html = Blueprint('html', __name__)
ws = Blueprint('ws', __name__)

@html.route('/start_game/<num_controllers>')
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
            controller_state['input'] = message
        _setController(game_id, controller_id, controller_state)
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

    
