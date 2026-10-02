#!/bin/bash
# 精彩混剪：從所有作品挑片段 → 1280x720 30fps → 串接 → 配上 Showreel 音樂
cd "$(dirname "$0")"
FF="/c/Users/User/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe"
SRC="/d/作品集網站/video"; W=montage-work
FIT="split[a][b];[a]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,boxblur=24:2,eq=brightness=-0.18[bg];[b]scale=-2:720[fg];[bg][fg]overlay=(W-w)/2:0,fps=30,format=yuv420p"
# 檔名 | 起點秒 | 長度 | 類型(v=影片 p=照片)
LIST="3D Animation＆ Motion Design  Showreel 2022-2023 ｜Alan Pan 潘睿能.mp4|12.5|3|v
運動筆記showreels.mp4|19|3|v
On_活動影片.mp4|5|2.6|v
破局者年會2026 - 複製.mp4|13|3|v
Ｄay 0 - 複製.mp4|2|2.6|v
輕影片_V臉油.mp4|2|2.6|v
3D Animation＆ Motion Design  Showreel 2022-2023 ｜Alan Pan 潘睿能.mp4|48|2.8|v
林小安談紀錄片.mp4|14|2.6|v
2025OASIS綠洲實習計畫-實習生紀錄片.mp4|301|3|v
/d/作品集網站/photo/新增資料夾/drive-download-20260924T103123Z-1-001/Urban3-13.jpg|0|2.5|p
上車台積電的機會來了嗎.mp4|8|2.6|v|tsmc
輕影片_仙人掌精華.mp4|3|2.6|v
破局者年會2026 - 複製.mp4|60|2.8|v
新手小白出入外匯.mp4|6|2.6|v
3D Animation＆ Motion Design  Showreel 2022-2023 ｜Alan Pan 潘睿能.mp4|60|2.8|v
運動筆記showreels.mp4|26|2.8|v
破局者年會2026短影音 - 複製.mp4|3|2.6|v
/d/作品集網站/photo/cloudflow 5-2.jpg|0|2.5|p
破局者年會2026 - 複製.mp4|68|3|v
3D Animation＆ Motion Design  Showreel 2022-2023 ｜Alan Pan 潘睿能.mp4|84|3.2|v"
rm -f $W/*.mp4 $W/list.txt; i=0
while IFS='|' read -r f ss d t x; do
  EX=""; [ "$x" = tsmc ] && EX=",$(cat tsmc-bright.txt)"
  i=$((i+1)); o=$(printf "$W/c%02d.mp4" $i)
  [[ "$f" = /* ]] || f="$SRC/$f"
  if [ "$t" = p ]; then
    "$FF" -nostdin -v error -y -loop 1 -t "$d" -i "$f" -vf "scale=2560:-2,crop=2560:1440,zoompan=z='min(zoom+0.0012,1.1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,format=yuv420p" -an -c:v libx264 -preset fast -crf 18 "$o"
  else
    "$FF" -nostdin -v error -y -ss "$ss" -t "$d" -i "$f" -filter_complex "[0:v]null$EX,$FIT[v]" -map "[v]" -an -c:v libx264 -preset fast -crf 18 "$o"
  fi
  echo "file 'c$(printf %02d $i).mp4'" >> $W/list.txt
done <<< "$LIST"
"$FF" -nostdin -v error -y -f concat -safe 0 -i $W/list.txt -c copy $W/joined.mp4
DUR=$("${FF%mpeg.exe}probe.exe" -v error -show_entries format=duration -of csv=p=0 $W/joined.mp4)
FO=$(python -c "print(max(0,$DUR-2.5))")
"$FF" -nostdin -v error -y -i $W/joined.mp4 -i "$SRC/運動筆記showreels.mp4" -map 0:v -map 1:a -t "$DUR" \
  -af "afade=t=in:d=0.4,afade=t=out:st=$FO:d=2.5" -c:v libx264 -preset slow -crf 26 -maxrate 1.4M -bufsize 2.8M -pix_fmt yuv420p -c:a aac -b:a 112k -movflags +faststart assets/video/montage.mp4
"$FF" -nostdin -v error -y -ss 1.5 -i assets/video/montage.mp4 -frames:v 1 -q:v 3 assets/video/montage-poster.jpg
echo "MONTAGE_DONE $DUR"
