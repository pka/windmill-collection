# Windmill collection

Collection of [Windmill](https://docs.windmill.dev/) scripts and other resources.

Docker images for custom windmill workers:
* `sourcepole/windmill-gdal`: Windmill worker with _GDAL/OGR/PDAL_ tools, _Python 3_ and _Deno_. Also used as base image for other windmill worker docker images.
* `sourcepole/windmill-osm`: Windmill worker with [osm2pgsql](https://osm2pgsql.org/), e.g. for OSM Flex import
* `sourcepole/windmill-alkis`: Windmill worker with [norGIS-ALKIS-Import](https://www.norbit.de/68/) tools for ALKIS import
