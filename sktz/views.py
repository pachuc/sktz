from sktz.utils import *
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
    return render_template('index.html', games=settings['GAME_LIST'])

@html.route('/create-game/', methods=['POST'])
def create_game():
    game_name = str(request.form['game'])
    game_id = id_generator()
    set_game(game_id, {})
    game = 'games/' + game_name + '_game.html'
    logging.error('Created new {0} game with id {1}'.format(game_name, game_id))
    return render_template(game, game_id=str(game_id), 
                                 game_name=game_name, 
                                 server_url=server_url)

@html.route('/create-controller/', methods=['POST'])
#@game_exists
def create_controller():
    game_id = str(request.form['gameid'])
    game_state = get_game(game_id)
    if not game_state['CAN_CONNECT']:
        logging.error(game_state['CAN_CONNECT'])
        return 'Cannot connect controller.'
    controller_template = 'controllers/' + game_state['CONTROLLER_TEMPLATE']
    num_controllers = game_state['NUM_CONTROLLERS']
    controller_id = get_next_controller_id(game_id, num_controllers)
    logging.error('Created new controller {0} on game {1}'.format(controller_id, game_id))
    return render_template(controller_template, controller_id=controller_id, game_id=game_id)

@html.route('/post-game-data/<game_id>', methods=['POST'])
@game_exists
def post_game_data(game_id):
    game_state = json.loads(request.data)
    set_game(game_id, game_state)
    logging.error('updating game state for game {0}: {1}'.format(game_id, game_state))
    return 'ok'

@html.route('/post-controller-data/<game_id>/<controller_id>')
@game_exists
def post_controller_data(game_id, controller_id, methods=['POST']):
    controller_state = json.loads(request.data)
    set_controller(game_id, controller_id, controller_state)
    logging.error('updated controller {0} on game {1}: {2}'.format(controller_id,
                                                                    game_id, 
                                                                    controller_state))
    return 'ok'

@html.route('/get-controller-data/<game_id>')
@game_exists
def get_controller_data(game_id):
    logging.error('Serving controller data for game {0}'.format(game_id))
    return get_controllers(game_id)

@html.route('/get-game-data/<game_id>')
@game_exists
def get_game_data(game_id):
    logging.error('Serving game data for game {0}'.format(game_id))
    return json.dumps(get_game(game_id))