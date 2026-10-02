# 從 Showreel 音樂偵測節拍：頻譜通量 onset → 自相關求 BPM → 對齊節拍格線
import numpy as np, json
sr=22050; x=np.fromfile('montage-work/music.raw',dtype=np.float32)
hop=512; win=2048
frames=np.lib.stride_tricks.sliding_window_view(x,win)[::hop]*np.hanning(win)
S=np.abs(np.fft.rfft(frames,axis=1)); S=np.log1p(S)
flux=np.maximum(0,np.diff(S,axis=0)).sum(1); flux=np.concatenate([[0],flux])
flux=(flux-flux.mean())/flux.std()
fps=sr/hop
ac=np.correlate(flux,flux,'full')[len(flux)-1:]
lo,hi=int(fps*60/170),int(fps*60/60)
lag=lo+np.argmax(ac[lo:hi]); bpm=60*fps/lag
period=lag
# 找最佳相位
best=max(range(int(period)),key=lambda p:flux[p::int(round(period))][:200].sum() if True else 0)
beats=[(best+k*period)/fps for k in range(int((len(flux)-best)/period))]
rms=[float(np.sqrt(np.mean(x[int(b*sr):int(b*sr)+sr//2]**2))) if int(b*sr)<len(x) else 0 for b in beats]
print('BPM',round(bpm,1),'first beat',round(beats[0],3),'n',len(beats))
print('beat',round(60/bpm,3),'s')
print('energy per 4 beats:',[round(np.mean(rms[i:i+4]),3) for i in range(0,min(len(rms),64),4)])
json.dump({'bpm':bpm,'beats':beats},open('montage-work/beats.json','w'))
