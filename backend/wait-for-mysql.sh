#!/bin/sh
echo "Waiting for MySQL to be ready..."
while ! nc -z mysql 3306; do
  sleep 1
done
echo "MySQL is up! Starting backend."
mvn spring-boot:run
