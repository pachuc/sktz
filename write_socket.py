from websocket import create_connection
import time

game_id = '3e04c424-335d-48a0-91e4-4a840c294abb'
controller_id = 0

while True:
    ws = create_connection('ws://localhost:8000/connect_controller/{0}/{1}'.format(game_id, controller_id))
    ws.send('Pressed')
    ws.close()
    time.sleep(10)        

