#!/bin/bash
# Wrapper script for image restore in Docker

# Default values
SOURCE="mega"
BACKUPS=()
WEEKS=()
ACTION="restore"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --source)
      SOURCE="$2"
      shift 2
      ;;
    --backups)
      shift
      while [[ $# -gt 0 ]] && [[ $1 != --* ]]; do
        BACKUPS+=("$1")
        shift
      done
      ;;
    --weeks)
      shift
      while [[ $# -gt 0 ]] && [[ $1 != --* ]]; do
        WEEKS+=("$1")
        shift
      done
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
CMD="python /app/restore_images.py --source $SOURCE"

if [[ ${#BACKUPS[@]} -gt 0 ]]; then
  CMD="$CMD --backups ${BACKUPS[@]}"
fi

if [[ ${#WEEKS[@]} -gt 0 ]]; then
  CMD="$CMD --weeks ${WEEKS[@]}"
fi

if [[ "$ACTION" == "list" ]]; then
  CMD="$CMD --list"
fi

# Execute command
exec $CMD