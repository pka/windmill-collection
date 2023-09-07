ARG GDAL_WORKER_IMAGE_TAG='v2023.07.12.01'

FROM sourcepole/windmill-gdal:${GDAL_WORKER_IMAGE_TAG}

ARG APP=/usr/src/app

# additional dependencies for ALKIS import
# NOTE: procmail required for lockfile
RUN apt update && \
    DEBIAN_FRONTEND=noninteractive apt install -y parallel procmail \
    && rm -rf /var/lib/apt/lists/*
RUN pip install lxml

# clone alkisimport and reset to selected version
ARG ALKISIMPORT_COMMIT='c64b713c'
RUN git clone https://github.com/norBIT/alkisimport.git ${APP}/alkisimport && \
    cd ${APP}/alkisimport && \
    git reset --hard $ALKISIMPORT_COMMIT
# disable setting locale in alkis-import.sh to avoid warnings on setlocale
RUN sed --in-place 's/export LC_CTYPE=de_DE.UTF-8/# &/g' ${APP}/alkisimport/alkis-import.sh

ENV WORKER_TAGS=alkis,gdal,docker,deno,python3,bash,flow,hub,dependency
