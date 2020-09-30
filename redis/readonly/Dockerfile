FROM redis
ARG REDIS_MASTER_HOST
ARG REDIS_MASTER_PASS
WORKDIR /usr/local/etc/redis/
COPY redis.conf raw.conf
RUN perl -p -i -e 's/\$\{([^}]+)\}/defined $ENV{$1} ? $ENV{$1} : $&/eg' < raw.conf > readonly.conf
CMD [ "redis-server", "/usr/local/etc/redis/readonly.conf" ]