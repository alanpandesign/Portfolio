# 節奏混剪 v2：純影片、跟著音樂節拍剪、每刀帶轉場
import shutil as _sh, os as _os
_HERE = _os.path.dirname(_os.path.abspath(__file__))
ROOT = _os.path.dirname(_HERE).replace("\\", "/")          # 作品集網站 資料夾（自動偵測）
import json, subprocess, os
os.chdir(_HERE)
FF=_os.environ.get("FFMPEG") or _sh.which("ffmpeg") or "ffmpeg"
SRC=ROOT+"/video/"; W="montage-work/v2/"; os.makedirs(W,exist_ok=True)
AN="3D Animation＆ Motion Design  Showreel 2022-2023 ｜Alan Pan 潘睿能.mp4"; SN="運動筆記showreels.mp4"; ON="On_活動影片.mp4"
BK="破局者年會2026 - 複製.mp4"; LD="林小安談紀錄片.mp4"
TSMC=open("tsmc-bright.txt",encoding="utf-8").read().strip()
# (檔名, 起點秒, 拍數, 額外濾鏡)
CLIPS=[(AN,12.5,2,""),(AN,21,1,""),(SN,19,2,""),(ON,5,2,""),(BK,13,2,""),("Ｄay 0 - 複製.mp4",2,1,""),
 ("上車台積電的機會來了嗎.mp4",8,1,TSMC),("新手小白出入外匯.mp4",6,2,""),(AN,48,2,""),(LD,10,2,""),("輕影片_V臉油.mp4",2,2,""),
 ("輕影片_仙人掌精華.mp4",3,1,""),(SN,26,1,""),(ON,13,2,""),("2025OASIS綠洲實習計畫-實習生紀錄片.mp4",301,2,""),(AN,60,2,""),
 (BK,37,2,""),(LD,75,2,""),("破局者年會2026短影音 - 複製.mp4",6,2,""),(SN,31,1,""),(ON,36,1,""),(AN,68,2,""),(LD,90,2,""),
 (AN,80,1,""),(AN,84,1,""),(BK,68,3,"")]
TR=["slideleft","zoomin","wipeup","smoothright","circleopen","hblur","slidedown","pixelize","radial","fadewhite","squeezeh",
    "diagtr","smoothleft","circlecrop","wiperight","zoomin","slideup","hlslice","fadewhite","smoothup","circleopen","wipeleft","pixelize","zoomin","radial"]
BEAT=0.650; T=0.25; FIT="split[a][b];[a]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,boxblur=24:2,eq=brightness=-0.18[bg];[b]scale=-2:720[fg];[bg][fg]overlay=(W-w)/2:0"
segs=[n*BEAT for _,_,n,_ in CLIPS]
for i,(f,ss,n,ex) in enumerate(CLIPS):
    L=segs[i]+T; vf=(ex+"," if ex else "")+FIT+",fps=30,format=yuv420p"
    subprocess.run([FF,"-nostdin","-v","error","-y","-ss",str(ss),"-t",f"{L:.3f}","-i",SRC+f,"-filter_complex",f"[0:v]{vf}[v]","-map","[v]","-an","-c:v","libx264","-preset","fast","-crf","18",f"{W}c{i:02d}.mp4"],check=True)
# 串接轉場
inputs=[]; 
for i in range(len(CLIPS)): inputs+=["-i",f"{W}c{i:02d}.mp4"]
fc=[]; prev="[0:v]"; off=0
for k in range(1,len(CLIPS)):
    off+=segs[k-1]; out=f"[x{k}]"
    fc.append(f"{prev}[{k}:v]xfade=transition={TR[(k-1)%len(TR)]}:duration={T}:offset={off:.3f}{out}"); prev=out
total=sum(segs)+T
# 音樂：從 43 秒附近的節拍起點開始，讓每個轉場中點落在拍點上
beats=json.load(open("montage-work/beats.json"))["beats"]
A=min(beats,key=lambda b:abs(b-43.0)); astart=A-T/2
print("clips",len(CLIPS),"total",round(total,2),"audio start",round(astart,3))
cmd=[FF,"-nostdin","-v","error","-y"]+inputs+["-ss",f"{astart:.3f}","-i",SRC+SN,"-filter_complex",";".join(fc)+f";[{len(CLIPS)}:a]atrim=0:{total:.3f},afade=t=in:d=0.15,afade=t=out:st={total-1.6:.3f}:d=1.6[a]",
 "-map",prev,"-map","[a]","-c:v","libx264","-preset","slow","-crf","25","-maxrate","1.8M","-bufsize","3.6M","-pix_fmt","yuv420p","-c:a","aac","-b:a","128k","-movflags","+faststart","assets/video/montage.mp4"]
subprocess.run(cmd,check=True)
subprocess.run([FF,"-nostdin","-v","error","-y","-ss","0.4","-i","assets/video/montage.mp4","-frames:v","1","-q:v","3","assets/video/montage-poster.jpg"],check=True)
print("MONTAGE_V2_DONE")
