FROM python:3.10-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
COPY ./ /app
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt --no-cache-dir
