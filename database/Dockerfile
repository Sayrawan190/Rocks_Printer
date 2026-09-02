FROM postgres:16-alpine

COPY schema.sql /docker-entrypoint-initdb.d/10-schema.sql
COPY seed.sql /docker-entrypoint-initdb.d/20-seed.sql
COPY set-initial-passwords.sh /docker-entrypoint-initdb.d/30-set-initial-passwords.sh
RUN chmod 755 /docker-entrypoint-initdb.d/30-set-initial-passwords.sh
