#!/usr/bin/env bash
# Generate per-country OG images (1200x630) at public/og/{slug}.jpg
set -euo pipefail

OUT=public/og
mkdir -p "$OUT" /tmp/og-flags

NAVY="#0f1b3d"
BG="#f5f3ee"
MUTED="#6b7280"

# Brand fonts (downloaded if missing)
SERIF=/tmp/fonts/PlayfairDisplay.ttf
SANS=/tmp/fonts/Inter.ttf
mkdir -p /tmp/fonts
[ -f "$SERIF" ] || curl -sSfL "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf" -o "$SERIF"
[ -f "$SANS" ]  || curl -sSfL "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf" -o "$SANS"

DATA=$(bun -e "import {acordos} from './src/data/acordos'; for (const a of acordos) console.log([a.slug, a.iso ?? '', a.nome, a.tipo, a.vigencia ?? ''].join('|'));")

MAGICK="nix run nixpkgs#imagemagick --"

render_base() {
  local slug="$1" meta="$2"
  $MAGICK -size 1200x630 "xc:$BG" \
    -font "$SERIF" -fill "$NAVY" \
    -gravity NorthWest -pointsize 200 -annotate +110+150 "AI" \
    -font "$SANS" -pointsize 20 \
    -annotate +95+360 "ACORDOS INTERNACIONAIS" \
    -stroke "$NAVY" -strokewidth 3 -fill none \
    -draw "path 'M 110,440 Q 220,485 330,440'" \
    -draw "circle 110,440 110,445" \
    -draw "circle 330,440 330,445" \
    -stroke none \
    -fill "#d4ccc1" \
    -draw "rectangle 470,90 472,540" \
    -font "$SANS" -fill "$NAVY" -pointsize 20 \
    -annotate +540+150 "ACORDO PREVIDENCIÁRIO" \
    -font "$SANS" -fill "$MUTED" -pointsize 28 \
    -annotate +540+330 "$meta" \
    -font "$SANS" -fill "$MUTED" -pointsize 16 \
    -gravity SouthEast -annotate +60+40 "BY  ATLASPREV" \
    "/tmp/og-base-$slug.png"
}

while IFS='|' read -r slug iso nome tipo vigencia; do
  [ -z "$slug" ] && continue
  echo "→ $slug"

  if [ "$tipo" = "multilateral" ]; then
    meta="Multilateral"
    [ -n "$vigencia" ] && meta="$meta · desde $vigencia"
    render_base "$slug" "$meta"

    # Título: nome do bloco (CPLP / Mercosul / Iberoamericano)
    $MAGICK -background "$BG" -fill "$NAVY" \
      -font "$SERIF" \
      -size 620x90 -gravity West \
      caption:"$nome" \
      "/tmp/og-title-$slug.png"

    # Selo textual no lugar da bandeira
    $MAGICK -size 280x170 "xc:$BG" \
      -bordercolor "#d4ccc1" -border 1 \
      -font "$SERIF" -fill "$NAVY" -pointsize 64 \
      -gravity Center -annotate 0 "MULTI" \
      "/tmp/og-flag-$slug.png"
  else
    [ -z "$iso" ] && continue
    tipo_label="Bilateral"
    meta="$tipo_label"
    [ -n "$vigencia" ] && meta="$meta · desde $vigencia"
    render_base "$slug" "$meta"

    flag=/tmp/og-flags/$iso.png
    [ -f "$flag" ] || curl -sSfL "https://flagcdn.com/w1280/$iso.png" -o "$flag"

    $MAGICK -background "$BG" -fill "$NAVY" \
      -font "$SERIF" \
      -size 620x90 -gravity West \
      caption:"Brasil–$nome" \
      "/tmp/og-title-$slug.png"

    $MAGICK "$flag" -resize 280x \
      -bordercolor "#d4ccc1" -border 1 \
      "/tmp/og-flag-$slug.png"
  fi

  $MAGICK /tmp/og-base-$slug.png \
    /tmp/og-title-$slug.png -geometry +540+200 -composite \
    /tmp/og-flag-$slug.png  -geometry +540+400 -composite \
    -quality 88 "$OUT/$slug.jpg"

  rm -f /tmp/og-base-$slug.png /tmp/og-title-$slug.png /tmp/og-flag-$slug.png
done <<< "$DATA"

echo "Done. Generated $(ls $OUT | wc -l) images."
