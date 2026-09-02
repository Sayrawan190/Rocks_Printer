#!/bin/sh
set -eu

psql --set ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --set=abdullah_password="$APP_PASSWORD_ABDULLAH" \
  --set=basel_password="$APP_PASSWORD_BASEL" \
  --set=saleh_password="$APP_PASSWORD_SALEH" \
  --set=rocks_password="$APP_PASSWORD_ROCKS" <<-'EOSQL'
UPDATE users SET password_hash = crypt(:'abdullah_password', gen_salt('bf')) WHERE username = 'Abdullah';
UPDATE users SET password_hash = crypt(:'basel_password', gen_salt('bf')) WHERE username = 'Basel';
UPDATE users SET password_hash = crypt(:'saleh_password', gen_salt('bf')) WHERE username = 'Saleh';
UPDATE users SET password_hash = crypt(:'rocks_password', gen_salt('bf')) WHERE username = 'Rocks';
EOSQL
