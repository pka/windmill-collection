ARG PYTHON_IMAGE_TAG='3.11-slim-bullseye'
ARG WINDMILL_IMAGE_TAG='1.128.0'
ARG DENO_IMAGE_TAG='1.35.0'

FROM ghcr.io/windmill-labs/windmill:${WINDMILL_IMAGE_TAG} as windmill
FROM denoland/deno:${DENO_IMAGE_TAG} as deno

FROM python:${PYTHON_IMAGE_TAG} as worker_base

ARG APP=/usr/src/app

RUN apt-get update \
    && apt-get install -y ca-certificates wget curl git jq libprotobuf-dev libnl-route-3-dev unzip build-essential \
    && rm -rf /var/lib/apt/lists/*

ENV TZ=Etc/UTC

RUN /usr/local/bin/python3 -m pip install pip-tools

COPY --from=windmill /usr/src/app/windmill ${APP}/windmill
RUN ln -s ${APP}/windmill /usr/local/bin/windmill

COPY --from=deno /usr/bin/deno /usr/bin/deno

COPY --from=docker:dind /usr/local/bin/docker /usr/local/bin/

WORKDIR ${APP}

ENV DISABLE_SERVER=true
ENV DENO_PATH=/usr/bin/deno
ENV PYTHON_PATH=/usr/local/bin/python3
ENV WORKER_TAGS=deno,python3,bash,flow,hub,dependency

CMD ["windmill"]


FROM worker_base

RUN apt-get update -yqq && \
    apt-get install -yqq \
            gdal-bin python3-gdal fiona python3-fiona rasterio python3-rasterio \
            postgresql-client && \
    apt-get install -y --no-install-recommends pdal && \
    rm -rf /var/lib/apt/lists/*

ENV WORKER_TAGS=gdal,deno,python3,bash,flow,hub,dependency
