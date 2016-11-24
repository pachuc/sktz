FROM debian:latest

COPY . /src
WORKDIR /src

RUN apt-get update && \
    apt-get install -y python python-pip python-dev

RUN pip install Flask-Sockets gunicorn

CMD gunicorn -b 0.0.0.0:8000 -k flask_sockets.worker hello:app 
