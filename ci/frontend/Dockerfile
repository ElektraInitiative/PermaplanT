FROM node:19-slim

VOLUME /bindings

ENV CI=true
ENV PORT=5173

EXPOSE 5173/tcp

WORKDIR /code

COPY ./frontend/package.json /code/package.json
COPY ./frontend/package-lock.json /code/package-lock.json
RUN npm ci
COPY ./frontend/ /code
COPY ./ci/frontend/entrypoint.sh /code/entry.sh

ENTRYPOINT /code/entry.sh
