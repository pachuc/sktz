from websocket import create_connection
import time

game_id = '45c3-94fd-8f0a42b120ef'
controller_id = 1
ws = create_connection('ws://localhost:8000/connect_controller/{0}/{1}'.format(game_id, controller_id))
while True:
    ws.send('Pressed')
    time.sleep(10)        

