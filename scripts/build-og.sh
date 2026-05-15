#!/usr/bin/env bash
# Generate per-country OG images (1200x630) at public/og/{slug}.jpg
set -euo pipefail

OUT=public/og
mkdir -p "$OUT" /tmp/og-flags

NAVY="#0f1b3d"
BG="#f5f3ee"
MUTED="#6b7280"

DATA=$(bun -e "import {acordos} from './src/data/acordos'; for (const a of acordos) if (a.iso) console.log([a.slug, a.iso, a.nome, a.tipo, a.vigencia ?? ''].join('|'));")

MAGICK="nix run nixpkgs#imagemagick --"

while IFS='|' read -r slug iso nome tipo vigencia; do
  [ -z "$slug" ] && continue
  echo "→ $slug ($iso)"

  flag=/tmp/og-flags/$iso.png
  if [ ! -f "$flag" ]; then
    curl -sSfL "https://flagcdn.com/w1280/$iso.png" -o "$flag"
  fi

  tipo_label="Bilateral"
  [ "$tipo" = "multilateral" ] && tipo_label="Multilateral"
  meta="$tipo_label"
  [ -n "$vigencia" ] && meta="$meta · desde $vigencia"

  # Composite: build pieces then merge
  # 1. Background canvas
  $MAGICK -size 1200x630 "xc:$BG" \
    \
    -font Liberation-Serif-Bold -fill "$NAVY" \
    -gravity NorthWest -pointsize 180 -annotate +90+130 "AI" \
    \
    -font Liberation-Sans-Bold -pointsize 22 \
    -annotate +95+340 "ACORDO INTERNACIONAL" \
    \
    -stroke "$NAVY" -strokewidth 3 -fill none \
    -draw "path 'M 100,420 Q 200,460 300,420'" \
    -draw "circle 100,420 100,425" \
    -draw "circle 300,420 300,425" \
    -stroke none \
    \
    -fill "#d4ccc1" \
    -draw "rectangle 470,90 472,540" \
    \
    -font Liberation-Sans-Bold -fill "$NAVY" -pointsize 20 \
    -annotate +540+150 "ACORDO PREVIDENCIÁRIO" \
    \
    -font Liberation-Serif-Bold -pointsize 78 \
    -annotate +540+260 "Brasil–$nome" \
    \
    -font Liberation-Sans -fill "$MUTED" -pointsize 28 \
    -annotate +540+330 "$meta" \
    \
    -font Liberation-Sans-Bold -fill "$MUTED" -pointsize 16 \
    -gravity SouthEast -annotate +60+40 "BY  ATLASPREV" \
    \
    /tmp/og-base-$slug.png

  # 2. Flag (resize to ~280 wide, add subtle border) and composite into right column
  $MAGICK "$flag" -resize 280x \
    -bordercolor "#d4ccc1" -border 1 \
    /tmp/og-flag-$slug.png

  $MAGICK /tmp/og-base-$slug.png /tmp/og-flag-$slug.png \
    -geometry +540+400 -composite \
    -quality 88 "$OUT/$slug.jpg"

  rm -f /tmp/og-base-$slug.png /tmp/og-flag-$slug.png
done <<< "$DATA"

echo "Done. Generated $(ls $OUT | wc -l) images."
