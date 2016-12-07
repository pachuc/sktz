from websocket import create_connection
import time
import requests
import json

print 'Enter game id:'
game_id = raw_input()
game_state = json.loads(requests.get('http://localhost:8000/get_game_state/{0}'.format(game_id)).text)
print game_state

#ws = create_connection('ws://localhost:8000/connect_controller/{0}/{1}'.format(game_id, controller_id))
#while True:
#    user_input = raw_input()
#    ws.send(user_input)        

