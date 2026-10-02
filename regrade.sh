#!/bin/bash
# 重新產生所有「調色版」預覽、封面、劇照與照片
cd "$(dirname "$0")"
FF="/c/Users/User/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe"
GRADE="$(cat grade.txt)"
rm -f assets/video/*-preview.mp4 assets/video/*-poster.jpg
bash encode.sh
# 劇照（從原始影片抽，套調色）
st(){ "$FF" -nostdin -v error -y -ss "$3" -i "/d/作品集網站/video/$2" -frames:v 1 -vf "scale=1280:-2,$GRADE" -q:v 3 "assets/img/stills/$1-$3.jpg"; }
for t in 150 330 420 600 700 785; do st oasis "2025OASIS綠洲實習計畫-實習生紀錄片.mp4" $t; done
for t in 5 13 37 53 61 69; do st breaker "破局者年會2026 - 複製.mp4" $t; done
for t in 19 24 28 32; do st sportsnote "運動筆記showreels.mp4" $t; done
# 照片
P="/d/作品集網站/photo"; U="$P/新增資料夾/drive-download-20260924T103123Z-1-001"
"$FF" -nostdin -v error -y -i "/d/作品集網站/形象照/形象照.jpg" -vf "scale=1000:-2,$GRADE" -q:v 3 assets/img/portrait.jpg
"$FF" -nostdin -v error -y -i "$P/cloudflow 5-2.jpg" -vf "scale=1400:-2,$GRADE" -q:v 3 assets/img/on-cloudflow.jpg
for f in "$U"/Urban3*.jpg; do b=$(basename "$f" .jpg); n=${b/Urban3/urban}; [ "$n" = urban ] && n=urban-1; "$FF" -nostdin -v error -y -i "$f" -vf "scale=1400:-2,$GRADE" -q:v 3 "assets/img/$n.jpg"; done
echo REGRADE_DONE
