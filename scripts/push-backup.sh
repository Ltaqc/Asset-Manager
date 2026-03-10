#!/bin/bash

echo "Starting backup..."

git add .

git commit -m "backup update"

git push origin main

echo "Backup complete."