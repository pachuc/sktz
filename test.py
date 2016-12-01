from websocket import create_connection
import time
import requests

print 'Sending request to start a game'
r = requests.get('http://localhost:8000/start_game')
print 'Got game id'
print r.text

game_id = r.text
print 'making failing request'
ws = create_connection('ws://localhost:8000/connect_controller/1/1')
print 'making successful request'
ws = create_connection('ws://localhost:8000/connect_controller/{0}/1'.format(game_id))
ws.send('Hello world')
ws.close()

