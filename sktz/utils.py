import string, random
from functools import wraps
from sktz import redis, settings
import json
import sktz
import logging

redis_timeout = settings['REDIS_TIMEOUT']

def get_controllers(game_id):
    game_state = get_game(game_id)
    num_controllers = game_state['num_controllers']
    controllers = []
    for controller_id in xrange(0, num_controllers):
        controllers.append(get_controller(game_id, controller_id))
    return json.dumps(controllers)

def get_game(game_id):
    return json.loads(redis.get(game_id))

def get_controller(game_id, controller_id):
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    return json.loads(redis.get(redis_key))


def get_next_controller_id(game_id, num_controllers):
    for i in xrange(0, num_controllers):
        if not redis.exists('{0}/{1}'.format(game_id, i)):
            return i
    return None


def set_game(game_id, game_state):
    redis.set(game_id, json.dumps(game_state), ex=redis_timeout)

def set_controller(game_id, controller_id, controller_state):
    redis_key = '{0}/{1}'.format(game_id, controller_id)
    redis.set(redis_key, json.dumps(controller_state), ex=redis_timeout)


def game_exists(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        game_id = kwargs['game_id']
        if redis.exists(game_id):
            return f(*args, **kwargs)
        else:
            raise Exception('Game does not exist.')
    return decorated_function

def id_generator(size=5, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
