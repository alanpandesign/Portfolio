# 潘睿能 Alan Pan 影音作品集網站

這個資料夾是 Alan（潘睿能）的個人作品集網站專案。使用者講中文（繁體），**一律用繁體中文回覆**，說明要白話、一步一步，因為使用者不是工程師。

**開始工作前，請先完整讀過 `site/交接說明.md`**（網站架構、影片流程、外部服務、設計規範都在裡面）。

## 資料夾結構
- `site/`：網站本體，也是 Git 倉庫 → GitHub `alanpandesign/Portfolio`
  - `index.html`、`style.css`、`main.js`：頁面、樣式、互動
  - `projects.js`：**所有作品的內容**（新增或修改作品通常只改這裡）
  - `assets/`：網頁用的壓縮影片與圖片
  - `encode.sh`、`mobile.sh`、`montage3.py`、`beats.py`、`regrade.sh`：影片處理腳本（路徑自動偵測，需要 FFmpeg）
- `video/`、`photo/`、`music/`、`形象照/`、`履歷/`：**原始素材**，不要修改或刪除
- `site/counter-admin-key.txt`：瀏覽人次服務的管理密鑰，**絕對不要上傳到 GitHub 或貼到任何地方**

## 正式網站
- 網址：https://alanpandesign.github.io/Portfolio/
- 影片透過 jsDelivr CDN 提供：`main.js` 裡的 `@media-v2` 標籤。**新增或更換影片後**要打新標籤（`media-v3`…）並更新 `main.js`，細節見交接說明

## 修改後上傳
在 `site/` 資料夾執行：
```
git add -A
git commit -m "說明這次改了什麼"
git push
```
約 1 分鐘後網站更新。第一次在新電腦 push 會跳出 GitHub 登入視窗，請使用者按授權。
- 如果出現 `detected dubious ownership`（記憶卡、外接硬碟常見），每個 git 指令前加 `-c safe.directory=*`，或執行一次 `git config --global --add safe.directory '*'`

## 本機預覽
在 `site/` 執行 `npx http-server . -p 5500 -c-1`，打開 http://localhost:5500/index.html
（本機瀏覽不會計入瀏覽人次）

## 設計規範（使用者明確要求過，請遵守）
- 黑底＋金色 `#f5c21b`，**內文全白**；整體參考 Behance 上 Achraf Chibane 的作品集風格
- 開場：Alan 金箔描字（Cormorant Garamond）＋「影音作品集」＋座右銘逐字打出，0→100% 依實際載入進度
- 座右銘：「以影為筆，以剪為刀，賦予影像第二次生命。」── Video Editor & Visual Planner
- **不要**出現 REC、閃爍紅點、臉部追蹤框（使用者覺得像偷拍、有壓力）
- **不要**按讚功能（已依使用者要求移除）
- **影片保留原色，不要調色**（使用者試過多種調色後決定不調）
- 影片要能自動播放（靜音、進入畫面才播）；點開要立刻能看全片（720p 版、開燈箱時釋放其他影片下載）
- 聯絡區：Email 一鍵寫信＋Gmail 網頁版＋複製；留言表單（姓名、Email、想說的話）經 FormSubmit 寄到 alanpan29351387@gmail.com；**不放電話**
- 手機與電腦版都要測試

## 工作習慣
- 改完先在本機預覽確認，再上傳；上傳後確認線上網站已更新
- 原始素材放在 `video/` 等資料夾，網頁用的檔案由腳本產生到 `site/assets/`
- jsDelivr 單檔上限 20 MB；GitHub 單檔上限 100 MB
