FROM python:3.11.1-slim-buster as worker_base

ARG APP=/usr/src/app

RUN apt-get update \
    && apt-get install -y ca-certificates wget curl git jq libprotobuf-dev libnl-route-3-dev unzip build-essential \
    && rm -rf /var/lib/apt/lists/*

ENV TZ=Etc/UTC

RUN /usr/local/bin/python3 -m pip install pip-tools

COPY --from=ghcr.io/windmill-labs/windmill:1.61.1 /usr/src/app/windmill ${APP}/windmill

COPY --from=denoland/deno:latest /usr/bin/deno /usr/bin/deno

ENV DISABLE_SERVER=true

WORKDIR ${APP}

CMD ["./windmill"]


FROM worker_base

RUN apt-get update -yqq && \
    apt-get install -yqq \
            gdal-bin python3-gdal fiona python3-fiona rasterio python3-rasterio \
    && rm -rf /var/lib/apt/lists/*
