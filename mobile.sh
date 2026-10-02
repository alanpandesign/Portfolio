#!/bin/bash
# 手機版完整影片：短邊 720、較低位元率，點開就能快速播放
cd "$(dirname "$0")"
FF="/c/Users/User/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe"
SRC="/d/作品集網站/video"; OUT=assets/video
S720="scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'"
LIST="sportsnote|運動筆記showreels.mp4|1.6M
on-event|On_活動影片.mp4|1.6M
breaker|破局者年會2026 - 複製.mp4|1.6M
breaker-short|破局者年會2026短影音 - 複製.mp4|1.6M
lin-doc|林小安談紀錄片.mp4|1.6M
vface|輕影片_V臉油.mp4|1.4M
cactus|輕影片_仙人掌精華.mp4|1.4M
day0|Ｄay 0 - 複製.mp4|1.6M
tsmc|上車台積電的機會來了嗎.mp4|1.6M
fx-guide|新手小白出入外匯.mp4|1.6M
anim|3D Animation＆ Motion Design  Showreel 2022-2023 ｜Alan Pan 潘睿能.mp4|1.6M
oasis|2025OASIS綠洲實習計畫-實習生紀錄片.mp4|700k"
echo "$LIST" | while IFS='|' read -r slug file rate; do
  EX=""; [ "$slug" = tsmc ] && EX=",$(cat tsmc-bright.txt)"
  [ -f "$OUT/$slug-m.mp4" ] || "$FF" -nostdin -v error -y -i "$SRC/$file" -vf "$S720,fps=30$EX" -c:v libx264 -preset medium -crf 26 -maxrate $rate -bufsize 2M -g 60 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "$OUT/$slug-m.mp4"
  echo "done $slug $(stat -c %s $OUT/$slug-m.mp4)"
done
echo MOBILE_DONE
