import requests

out = requests.get('http://localhost:8000/get_input/1')
print out.text	
