from websocket import create_connection
import time

game_id = '94ecfee2-84b2-4fa6-b7b0-a52dce591abc'
controller_id = 0

while True:
    ws = create_connection('ws://localhost:8000/connect_controller/{0}/{1}'.format(game_id, controller_id))
    ws.send('Connected')
    ws.close()
    time.sleep(10)        

