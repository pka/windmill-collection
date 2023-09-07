# NOTE: does not use sourcepole/windmill-gdal as base image, but extends 3dcitydb/impexp image

ARG WINDMILL_IMAGE_TAG='1.128.0'
ARG CITYDB_IMAGE_TAG='15-3.3-4.4.0'
ARG CITYDB_IMPEXP_IMAGE_TAG='5.3.0'

FROM ghcr.io/windmill-labs/windmill:${WINDMILL_IMAGE_TAG} as windmill
FROM 3dcitydb/3dcitydb-pg:${CITYDB_IMAGE_TAG} as citydb

FROM 3dcitydb/impexp:${CITYDB_IMPEXP_IMAGE_TAG}
# https://github.com/3dcitydb/importer-exporter/blob/master/Dockerfile
# Java client based on Debian 11 (bullseye)

ARG APP=/usr/src/app
ENV TZ=Etc/UTC

COPY --from=windmill /usr/src/app/windmill ${APP}/windmill

# copy 3DCityDB scripts for DB setup
COPY --from=citydb /3dcitydb/ /opt/3dcitydb

USER root
RUN apt update && \
    DEBIAN_FRONTEND=noninteractive apt install -y postgresql-client python3 python3-pip git libpq-dev && \
    rm -rf /var/lib/apt/lists/*
RUN python3 -m pip install pip-tools

# clone py3dtilers
ARG PY3DTILERS_TAG='v1.2.0'
RUN git clone --branch $PY3DTILERS_TAG https://github.com/VCityTeam/py3dtilers.git ${APP}/py3dtilers && \
    chown -R impexp:impexp ${APP}/py3dtilers
# patch centroid check in CityTiler::set_features_centroid()
RUN sed --in-place 's/if centroid is not None:/if centroid is not None and centroid != []:/g' ${APP}/py3dtilers/py3dtilers/CityTiler/CityTiler.py

USER impexp
# add python module binaries in $HOME to PATH
ENV PATH="/data/.local/bin:$PATH"
# install py3dtilers and its module dependencies
RUN cd ${APP}/py3dtilers/ && \
    pip install -e .

# Reset entrypoint "impexp"
ENTRYPOINT []
CMD ["/usr/src/app/windmill"]

ENV DISABLE_SERVER=true
ENV PYTHON_PATH=/usr/bin/python3
ENV WORKER_TAGS=3dcitydb,py3dtilers,java,python3,bash,flow,hub,dependency

# NOTE: runs as user 'impexp' with $HOME in /data
