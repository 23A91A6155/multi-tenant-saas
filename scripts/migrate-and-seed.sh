#!/bin/sh
psql postgresql://postgres:postgres@localhost:5432/multitenant \
-f database/migrations/001_create_tables.sql \
-f database/seeds/seed.sql
