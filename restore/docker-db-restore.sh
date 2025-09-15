#!/bin/bash
# Wrapper script for database restore in Docker

# Default values
SOURCE="mega"
BACKUP=""
ACTION="restore"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --source)
      SOURCE="$2"
      shift 2
      ;;
    --backup)
      BACKUP="$2"
      shift 2
      ;;
    --list)
      ACTION="list"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Build command
CMD="python /app/restore_db.py --source $SOURCE"

if [[ -n "$BACKUP" ]]; then
  CMD="$CMD --backup $BACKUP"
fi

if [[ "$ACTION" == "list" ]]; then
  CMD="$CMD --list"
fi

# Execute command
exec $CMD
