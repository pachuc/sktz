FROM debian:latest
RUN apt-get update && \
    apt-get install -y python python-pip python-dev
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . /src
WORKDIR /src
RUN pip install -e .
