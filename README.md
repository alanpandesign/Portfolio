# 潘睿能 Alan Pan 作品集網站

## 本機預覽
在 `site` 資料夾執行：`npx http-server . -p 5500`，再開 http://localhost:5500/index.html

## 新增一支影片
1. 把原檔放進 `D:\作品集網站\video\`
2. 在 `encode.sh` 的 LIST 加一行：`英文代號|原檔檔名.mp4|預覽起點秒數`，執行 `bash encode.sh`
   → 產生 12 秒靜音預覽（已套統一調色）、有聲完整版（保留原色）、封面
3. 在 `projects.js` 找到想放的章節／專案，加上 `{ video: "英文代號", ar: 16 / 9 }`
   （直式短影音放進 phones：`{ video: "英文代號", title: "標題", sub: "說明" }`）

## 統一調色
- 調色設定在 `grade.txt`（ffmpeg 濾鏡）
- 改完執行 `bash regrade.sh`，會重新產生所有預覽、封面、劇照與照片

## 檔案
- `projects.js`：章節與作品內容 ← 平常只要改這個
- `index.html`：封面、關於我、目錄、聯絡
- `style.css` / `main.js`：樣式與互動
- `assets/`：網頁用影片與圖片（原檔不會被修改）
## 影片 CDN（重要）
- 網站在 GitHub Pages，但影片透過 jsDelivr 讀取（快約 100 倍）：`https://cdn.jsdelivr.net/gh/alanpandesign/Portfolio@media-vN/…`
- **新增或更換影片後**：提交並推上 GitHub → 建立新標籤（例如 `git tag media-v3` 再 `git push origin media-v3`）→ 把 `main.js` 裡的 `@media-v2` 改成新標籤 → 再推一次
- jsDelivr 單檔上限 20 MB；超過的長片請切成串流分段（見 OASIS 的 `oasis-hls/`）
- jsDelivr 若失敗，網站會自動改讀 GitHub 上的同一個檔案
