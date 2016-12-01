from websocket import create_connection
import time

while True:
    ws = create_connection("ws://localhost:8000/controller/1")
    ws.send("Hello, World")
    ws.close()
    time.sleep(60)        

