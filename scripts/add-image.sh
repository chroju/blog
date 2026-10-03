#!/bin/bash
# Usage: add-image.sh <slug> <name> [src]
# Copies src (or the clipboard image when omitted) to
# public/images/<post date>/<name>.<ext>, then prints the Markdown embed
# and copies it to the clipboard.
set -euo pipefail

slug=$1
name=$2
src=${3:-}

post="./posts/$slug.md"
if [ ! -f "$post" ]; then
  echo "error: $post not found" >&2
  exit 1
fi

date=$(sed -n 's/^date: *"\{0,1\}\([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\).*/\1/p' "$post" | head -n 1)
if [ -z "$date" ]; then
  echo "error: date not found in front matter of $post" >&2
  exit 1
fi

if [[ "$name" == *.* ]]; then
  ext=${name##*.}
  base=${name%.*}
elif [ -n "$src" ]; then
  ext=$(echo "${src##*.}" | tr '[:upper:]' '[:lower:]')
  base=$name
else
  ext=png
  base=$name
fi

dir="./public/images/$date"
dest="$dir/$base.$ext"
if [ -e "$dest" ]; then
  echo "error: $dest already exists" >&2
  exit 1
fi
mkdir -p "$dir"

if [ -n "$src" ]; then
  cp "$src" "$dest"
else
  if [ "$ext" != png ]; then
    echo "error: clipboard images are saved as png" >&2
    exit 1
  fi
  abs="$(cd "$dir" && pwd)/$base.$ext"
  if ! osascript - "$abs" >/dev/null 2>&1 <<'EOS'
on run argv
  set png to (the clipboard as «class PNGf»)
  set f to open for access (POSIX file (item 1 of argv)) with write permission
  write png to f
  close access f
end run
EOS
  then
    rm -f "$dest"
    echo "error: no image in clipboard" >&2
    exit 1
  fi
fi

md="![$base](/images/$date/$base.$ext)"
printf %s "$md" | pbcopy
echo "$md"
