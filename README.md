# Open Telemetry + Prometheus + Grafana + Zipkin + FluentBit + Opensearch

This is a boilerplate for observability application

### Requirements:
* Docker
* Docker Compose

### Installation:

Just copy the file `.env.example` to `.env`.

### Start the project:

```shell
docker-compose up -d
```

App running on:

```shell
http://127.0.0.1:3000
```

Opensearch Dashboard

```shell
http://127.0.0.1:5601
```

Zipkin

```shell
http://127.0.0.1:9411
```

Grafana

```shell
http://127.0.0.1:3001
```

Prometheus

```shell
http://127.0.0.1:9090
```