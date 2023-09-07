ARG GDAL_WORKER_IMAGE_TAG='v2023.07.12.01'

FROM sourcepole/windmill-gdal:${GDAL_WORKER_IMAGE_TAG}

# cf. https://github.com/rustprooflabs/pgosm-flex/blob/main/Dockerfile

# additional dependencies for OSM flex import
RUN apt update && \
    DEBIAN_FRONTEND=noninteractive apt install -y \
      cmake \
      libexpat1-dev libbz2-dev zlib1g-dev \
      libboost-dev libboost-system-dev libboost-filesystem-dev \
      libpq-dev libproj-dev \
      liblua5.4-dev \
      libboost-filesystem1.74.0 \
      lua5.4 liblua5.4-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp

# install luarocks
# NOTE: do not use the luarocks package, as it is built against lua5.1
ARG LUAROCKS_VERSION='3.9.2'
RUN wget https://luarocks.org/releases/luarocks-$LUAROCKS_VERSION.tar.gz && \
    tar zxpf luarocks-$LUAROCKS_VERSION.tar.gz && \
    cd luarocks-$LUAROCKS_VERSION && \
    ./configure && make && make install && \
    rm -r /tmp/luarocks-$LUAROCKS_VERSION
# install lua module dependencies
RUN luarocks install lua-toml

# install osm2pgsql
# NOTE: do not use the osm2pgsql package, as it would install full PostgreSQL and PostGIS packages
ARG OSM2PGSQL_TAG='1.8.1'
RUN git clone --depth 1 --branch $OSM2PGSQL_TAG https://github.com/openstreetmap/osm2pgsql.git && \
    mkdir osm2pgsql/build && \
    cd osm2pgsql/build && \
    cmake .. -D USE_PROJ_LIB=6 && \
    make -j$(nproc) && \
    make install && \
    apt remove -y \
      cmake \
      libexpat1-dev libbz2-dev zlib1g-dev \
      libboost-dev libboost-system-dev \
      libpq-dev libproj-dev \
      liblua5.4-dev \
    && apt autoremove -y && \
    rm -r /tmp/osm2pgsql

# revert workdir
WORKDIR /usr/src/app

ENV WORKER_TAGS=osm,gdal,docker,deno,python3,bash,flow,hub,dependency

# some other change
