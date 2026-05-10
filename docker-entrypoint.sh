#!/bin/sh
set -e
envsubst '${ANTHROPIC_API_KEY}' < /etc/env.js.template > /usr/share/nginx/html/env.js
exec nginx -g 'daemon off;'
