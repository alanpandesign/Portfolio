# 節奏混剪 v3：配 BalloonPlanet - Voices in the Dust，20 秒淡入；鋪陳段 2 拍一刀，drop 後 1 拍一刀
import shutil as _sh, os as _os
_HERE = _os.path.dirname(_os.path.abspath(__file__))
ROOT = _os.path.dirname(_HERE).replace("\\", "/")          # 作品集網站 資料夾（自動偵測）
import json, subprocess, os
os.chdir(_HERE)
FF=_os.environ.get("FFMPEG") or _sh.which("ffmpeg") or "ffmpeg"
SRC=ROOT+"/video/"; MUSIC=ROOT+"/music/BalloonPlanet - Voices in the Dust.mp3"
W="montage-work/v3/"; os.makedirs(W,exist_ok=True)
AN="3D Animation＆ Motion Design  Showreel 2022-2023 ｜Alan Pan 潘睿能.mp4"; SN="運動筆記showreels.mp4"; ON="On_活動影片.mp4"
BK="破局者年會2026 - 複製.mp4"; LD="林小安談紀錄片.mp4"; OA="2025OASIS綠洲實習計畫-實習生紀錄片.mp4"
TS=("上車台積電的機會來了嗎.mp4", open("tsmc-bright.txt",encoding="utf-8").read().strip())
BUILD=[(AN,12.5),(AN,21),(SN,19),(OA,301),(BK,5),("輕影片_V臉油.mp4",2),("輕影片_仙人掌精華.mp4",3),(LD,10),(ON,1),(BK,13),
       ("Ｄay 0 - 複製.mp4",2),("新手小白出入外匯.mp4",6),TS[0:1]+(8,),(OA,150),(AN,48)]
DROP=[(AN,60),(ON,5),(SN,26),(BK,37),(LD,75),(AN,68),("破局者年會2026短影音 - 複製.mp4",6),(SN,31),(ON,36),(LD,90),(AN,52),(ON,13),(SN,23),(AN,80),(AN,84),(BK,60)]
END=[(BK,68)]
beats=json.load(open("montage-work/beats.json"))["beats"]; bp=beats[1]-beats[0]
A=min(beats,key=lambda b:abs(b-20.0)); D=min(beats,key=lambda b:abs(b-46.0))
nb=round((D-A)/bp)                     # 鋪陳段拍數
build_beats=[2]*len(BUILD); build_beats[-1]+=nb-sum(build_beats)   # 讓第一個快切剛好落在 drop
clips=[(f,s,b) for (f,s),b in zip(BUILD,build_beats)]+[(f,s,1) for f,s in DROP]+[(f,s,3) for f,s in END]
seg=[b*bp for _,_,b in clips]
T=[0]+[0.35]*(len(BUILD)-1)+[0.2]*(len(DROP)+len(END))       # 第 k 個轉場（在第 k 個鏡頭開頭）
T[len(BUILD)]=0.12                                            # drop 那刀：幾乎硬切，最有力
TRB=["fade","smoothleft","circleopen","fadeblack","smoothup","dissolve","radial","smoothright","circleclose","fade","wipeleft","smoothdown","horzopen","fadewhite"]
TRD=["slideleft","zoomin","pixelize","fadewhite","slideup","hblur","squeezeh","wiperight","zoomin","diagtr","slidedown","fadewhite","hlslice","zoomin","radial","slideright","fade"]
TRS=[None]+TRB[:len(BUILD)-1]+["fadewhite"]+TRD[:len(DROP)+len(END)-1]
FIT="split[a][b];[a]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,boxblur=24:2,eq=brightness=-0.18[bg];[b]scale=-2:720[fg];[bg][fg]overlay=(W-w)/2:0"
n=len(clips)
for i,(f,ss,b) in enumerate(clips):
    L=seg[i]+(T[i]/2 if i>0 else 0)+(T[i+1]/2 if i+1<n else 0)
    pre=(TS[1]+",") if f==TS[0] else ""
    subprocess.run([FF,"-nostdin","-v","error","-y","-ss",str(ss),"-t",f"{L:.3f}","-i",SRC+f,"-filter_complex",f"[0:v]{pre}{FIT},fps=30,format=yuv420p[v]","-map","[v]","-an","-c:v","libx264","-preset","fast","-crf","18",f"{W}c{i:02d}.mp4"],check=True)
inp=[]
for i in range(n): inp+=["-i",f"{W}c{i:02d}.mp4"]
fc=[]; prev="[0:v]"; c=0
for k in range(1,n):
    c+=seg[k-1]; out=f"[x{k}]"
    fc.append(f"{prev}[{k}:v]xfade=transition={TRS[k]}:duration={T[k]}:offset={c-T[k]/2:.3f}{out}"); prev=out
total=sum(seg)
print("clips",n,"build beats",nb,"drop at",round(D-A,2),"s  total",round(total,2),"s  music",round(A,2),"->",round(A+total,2))
subprocess.run([FF,"-nostdin","-v","error","-y"]+inp+["-ss",f"{A:.3f}","-i",MUSIC,"-filter_complex",";".join(fc)+f";[{n}:a]atrim=0:{total:.3f},afade=t=in:d=1.8,afade=t=out:st={total-2.2:.3f}:d=2.2[a]",
 "-map",prev,"-map","[a]","-c:v","libx264","-preset","slow","-crf","25","-maxrate","1.9M","-bufsize","3.8M","-pix_fmt","yuv420p","-c:a","aac","-b:a","128k","-movflags","+faststart","assets/video/montage.mp4"],check=True)
subprocess.run([FF,"-nostdin","-v","error","-y","-ss","0.5","-i","assets/video/montage.mp4","-frames:v","1","-q:v","3","assets/video/montage-poster.jpg"],check=True)
print("MONTAGE_V3_DONE")
