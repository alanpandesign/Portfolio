#!/bin/bash
# 把 ../video 的原檔轉成網頁用版本（原檔不會被修改）
# 用法：bash encode.sh
FF="/c/Users/User/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe"
SRC="/d/作品集網站/video"
OUT="/d/作品集網站/site/assets/video"
# slug | 原檔 | 預覽起點(秒)
LIST="sportsnote|運動筆記showreels.mp4|18
on-event|On_活動影片.mp4|2
breaker|破局者年會2026 - 複製.mp4|6
breaker-short|破局者年會2026短影音 - 複製.mp4|2
lin-doc|林小安談紀錄片.mp4|13
vface|輕影片_V臉油.mp4|2
cactus|輕影片_仙人掌精華.mp4|2
oasis|2025OASIS綠洲實習計畫-實習生紀錄片.mp4|300
day0|Ｄay 0 - 複製.mp4|1
tsmc|上車台積電的機會來了嗎.mp4|6
fx-guide|新手小白出入外匯.mp4|1
anim|3D Animation＆ Motion Design  Showreel 2022-2023 ｜Alan Pan 潘睿能.mp4|12"
SHORT720="scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'"
SHORT540="scale='if(gt(iw,ih),-2,540)':'if(gt(iw,ih),540,-2)'"
SHORT1080="scale='if(gt(iw,ih),-2,1080)':'if(gt(iw,ih),1080,-2)'"
# 統一調色（只套用在網站預覽／封面，完整版保留原色）
GRADE="$(cat "$(dirname "$0")/grade.txt")"
echo "$LIST" | while IFS='|' read -r slug file start; do
  in="$SRC/$file"
  [ -f "$OUT/$slug-poster.jpg" ] || "$FF" -nostdin -v error -y -ss $((start+3)) -i "$in" -frames:v 1 -vf "$SHORT1080,$GRADE" -q:v 3 "$OUT/$slug-poster.jpg"
  [ -f "$OUT/$slug-preview.mp4" ] || "$FF" -nostdin -v error -y -ss "$start" -t 10 -i "$in" -an -vf "$SHORT540,fps=30,$GRADE" -c:v libx264 -preset slow -crf 28 -maxrate 900k -bufsize 1800k -g 30 -keyint_min 30 -pix_fmt yuv420p -movflags +faststart "$OUT/$slug-preview.mp4"
  [ -f "$OUT/$slug.mp4" ] || "$FF" -nostdin -v error -y -i "$in" -vf "$SHORT1080" -c:v libx264 -preset veryfast -crf 24 -maxrate 4M -bufsize 8M -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$OUT/$slug.mp4"
  echo "done $slug"
done
echo ALL_DONE
