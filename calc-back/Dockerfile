FROM python:3.7

RUN mkdir -p /home/calc-backend
WORKDIR /home/calc-backend
COPY requirements.txt ./
COPY gunicorn_config.py ./
RUN apt update && \
    apt install -y netcat-openbsd
RUN pip install -r requirements.txt
# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
COPY . .
EXPOSE 5000
