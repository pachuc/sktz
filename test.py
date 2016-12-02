import time
import json
import requests

num_controllers = 4
print 'Intializing the game with {0} controllers'.format(num_controllers)
r = requests.get('http://localhost:8000/start_game/{0}'.format(num_controllers))
game_id = r.text
print 'Game intialized with id {0}'.format(game_id)

while True:
    r = requests.get('http://localhost:8000/get_game_state/{0}'.format(game_id))
    game_state = json.loads(r.text)
    for i in xrange(0, num_controllers):
        controller_name = 'controller {0}'.format(i)
        print '{0} is {1}'.format(controller_name, game_state[controller_name])        
    time.sleep(30)
