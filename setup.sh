#!/bin/bash
# Generate backend/.env and frontend/.env.local from root .env

set -e
ROOT_ENV="$(dirname "$0")/.env"

if [ ! -f "$ROOT_ENV" ]; then
    echo "Error: $ROOT_ENV not found. Run: cp .env.example .env"
    exit 1
fi

# Source root .env
set -a; source "$ROOT_ENV"; set +a

# Generate backend/.env
cat > "$(dirname "$0")/backend/.env" << EOF
APP_NAME=${APP_NAME:-PortfolioIT}
APP_ENV=${APP_ENV:-local}
APP_KEY=${APP_KEY:-}
APP_DEBUG=${APP_DEBUG:-true}
APP_URL=${APP_URL:-http://localhost:8000}

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_MAINTENANCE_DRIVER=file
BCRYPT_ROUNDS=12
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=${DB_CONNECTION:-mysql}
DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-portfolio}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD}

SESSION_DRIVER=${SESSION_DRIVER:-file}
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=${CACHE_STORE:-file}

REDIS_CLIENT=${REDIS_CLIENT:-predis}
REDIS_HOST=${REDIS_HOST:-127.0.0.1}
REDIS_PASSWORD=${REDIS_PASSWORD:-null}
REDIS_PORT=${REDIS_PORT:-6379}

MAIL_MAILER=${MAIL_MAILER:-smtp}
MAIL_HOST=${MAIL_HOST:-127.0.0.1}
MAIL_PORT=${MAIL_PORT:-1025}
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@portfolio.com"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="\${APP_NAME}"

JWT_SECRET=${JWT_SECRET:-}
EOF

# Generate frontend/.env.local
cat > "$(dirname "$0")/frontend/.env.local" << EOF
FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000}
API_BACKEND_URL=${API_BACKEND_URL:-http://localhost:8000}
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-/api/v1}
EOF

echo "Generated backend/.env and frontend/.env.local from .env"
