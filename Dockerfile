#
# Image
#
FROM node:14-alpine

ENV \
  PORT="8055" \
  PUBLIC_URL="/" \
  DB_CLIENT="sqlite3" \
  DB_FILENAME="/directus/database/database.sqlite" \
  RATE_LIMITER_ENABLED="false" \
  RATE_LIMITER_STORE="memory" \
  RATE_LIMITER_POINTS="25" \
  RATE_LIMITER_DURATION="1" \
  CACHE_ENABLED="false" \
  STORAGE_LOCATIONS="local" \
  STORAGE_LOCAL_PUBLIC_URL="/uploads" \
  STORAGE_LOCAL_DRIVER="local" \
  STORAGE_LOCAL_ROOT="/directus/uploads" \
  ACCESS_TOKEN_TTL="15m" \
  REFRESH_TOKEN_TTL="7d" \
  REFRESH_TOKEN_COOKIE_SECURE="false" \
  REFRESH_TOKEN_COOKIE_SAME_SITE="lax" \
  OAUTH_PROVIDERS="" \
  EXTENSIONS_PATH="/directus/extensions" \
  EMAIL_FROM="no-reply@directus.io" \
  EMAIL_TRANSPORT="sendmail" \
  EMAIL_SENDMAIL_NEW_LINE="unix" \
  EMAIL_SENDMAIL_PATH="/usr/sbin/sendmail"

RUN \
  apk update && \
  apk upgrade && \
  apk add bash ssmtp util-linux

SHELL ["/bin/bash", "-c"]

WORKDIR /directus

# Global requirements
RUN npm install -g yargs pino pino-colada

# Install Directus
COPY ./package.json .
RUN npm install

# Copy files
COPY . /

# Create directories
RUN \
  mkdir -p extensions/displays && \
  mkdir -p extensions/interfaces && \
  mkdir -p extensions/layouts && \
  mkdir -p extensions/modules && \
  mkdir -p database && \
  mkdir -p uploads

COPY ./extensions/ ./extensions/

EXPOSE 8055
VOLUME \
  /directus/database \
  /directus/extensions \
  /directus/uploads

CMD ["npx", "directus", "start"]