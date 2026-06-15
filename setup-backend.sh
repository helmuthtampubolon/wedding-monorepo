#!/usr/bin/env bash
# Run from monorepo root AFTER `composer create-project laravel/laravel backend`
set -e
cd "$(dirname "$0")"

echo ">> Installing Sanctum..."
( cd backend && composer require laravel/sanctum --no-interaction )

echo ">> Overlaying custom files..."
cp -R backend-overlay/. backend/

echo ">> Updating .env..."
cd backend
sed -i.bak 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/' .env || true
grep -q "^DB_HOST=" .env || echo "DB_HOST=127.0.0.1" >> .env
grep -q "^DB_PORT=" .env || echo "DB_PORT=3306" >> .env
grep -q "^DB_DATABASE=" .env || echo "DB_DATABASE=wedding" >> .env
grep -q "^DB_USERNAME=" .env || echo "DB_USERNAME=root" >> .env
grep -q "^DB_PASSWORD=" .env || echo "DB_PASSWORD=" >> .env
grep -q "^FRONTEND_URL=" .env || echo "FRONTEND_URL=http://localhost:5173" >> .env

echo ">> Done. Run: php artisan key:generate && php artisan migrate --seed && php artisan serve"
