import string, random
from functools import wraps
from sktz import redis
import json
import sktz
import logging


def _getGame(game_id):
    return json.loads(redis.get(game_id))

def _getController(game_id, controller_id):
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    return json.loads(redis.get(redis_key))

def _setGame(game_id, game_state):
    redis.set(game_id, json.dumps(game_state))

def _setController(game_id, controller_id, controller_state):
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    redis.set(redis_key, json.dumps(controller_state))

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
