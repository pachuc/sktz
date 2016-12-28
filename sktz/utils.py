import string, random
from functools import wraps
from sktz import redis, settings
import json
import sktz
import logging

redis_timeout = settings['REDIS_TIMEOUT']

def _assembleGameState(game_id):
    game_state = _getGame(game_id)
    num_controllers = game_state['num_controllers']
    for controller_id in xrange(0, num_controllers):
        controller_name = 'controller{0}'.format(controller_id)
        game_state[controller_name] = _getController(game_id, controller_id)
    return json.dumps(game_state)

def _getGame(game_id):
    return json.loads(redis.get(game_id))

def _getController(game_id, controller_id):
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    return json.loads(redis.get(redis_key))

def _setGame(game_id, game_state):
    redis.set(game_id, json.dumps(game_state), ex=redis_timeout)

def _setController(game_id, controller_id, controller_state):
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    redis.set(redis_key, json.dumps(controller_state), ex=redis_timeout)

def _gameExists(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        game_id = kwargs['game_id']
        if redis.exists(game_id):
            return f(*args, **kwargs)
        else:
            logging.error('Game {0} does not exist'.format(game_id))
    return decorated_function

def _idGenerator(size=5, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
