# ☁️ 雲端表情符號庫 (Cloud Emoji Manager)

這是一個專為解決跨平台（特別是 Discord 非 Nitro 用戶）表情符號使用痛點而設計的**自主控管、跨電腦同步**的表情符號管理工具。

本專案完全去中心化，不依賴第三方圖床服務（如 Imgur）。所有的表情符號圖片皆安全的儲存在您自己的 **Google Drive** 中，並透過 **Google 試算表** 進行資料索引與管理，達成 100% 的資料所有權掌控。

---

## ✨ 核心功能

* **Discord 風格介面**：緊湊的網格排列（Grid Layout），滑鼠懸停時自動浮現表情名稱的氣泡提示（Tooltip），視覺體驗流暢。
* **複製實體圖片**：點擊表情符號時，程式會透過 HTML5 Canvas 將圖片轉為 PNG Blob 格式，**直接將「真正的圖片資料」寫入剪貼簿**，而非單純的網址。在任何通訊軟體（Discord、Slack、LINE 等）直接按 `Ctrl+V` 即可貼上圖片。
* **全域貼上快捷上傳**：在網頁任何地方按下 `Ctrl+V`（只要剪貼簿內有圖片），系統會自動彈出新增視窗並載入圖片，實現一鍵命名快速上傳。
* **完美避開儲存上限**：圖片實體存於雲端硬碟，試算表僅儲存簡短的「檔案 ID」，徹底解決 Google 試算表單一儲存格 50,000 字元的 Base64 字數上限問題。
* **極速同步與優化**：採用 `lh3.googleusercontent.com` 圖片外連格式，載入速度快且穩定不破圖；刪除功能採用**樂觀更新 (Optimistic UI)** 機制，操作體感零延遲。
* **自主儲存與跨裝置同步**：前端為純靜態網頁，可部署於任何免費空間（GitHub Pages、Vercel 等），並支援綁定個人專屬子網域（Subdomain）。

---

## 🛠️ 系統架構

```
[前端網頁 (Index.html)] 
       │
       ├─► (點擊表情) ──► Canvas 轉換 ──► 寫入本機剪貼簿 (實體圖片)
       │
       ├─► (讀取/上傳/刪除) ──► 透過 HTTPS Fetch API
       │
       ▼
[Google Apps Script (API 後端)]
       │
       ├─► 儲存/刪除圖片檔案 ──► [Google Drive 資料夾]
       │
       └─► 寫入/刪除索引資料 ──► [Google 試算表 (Database)]
```

---

## 🚀 架設與部署指南

### 第一步：後端與資料庫設定

1.  **建立雲端資料夾**：
    * 在 Google Drive 中建立一個新資料夾（例如：`My_Emojis`）。
    * 進入資料夾，從網址列複製最後一長串亂碼，此為 `FOLDER_ID`。
2.  **建立試算表**：
    * 在雲端硬碟建立一個全新的 Google 試算表（例如：`Emoji_Database`）。
    * 在第一列的 A1、B1、C1 分別輸入 `檔案 ID`、`名稱`、`日期` 作為欄位標題。
    * 從試算表網址列的 `/d/` 與 `/edit` 之間複製那一長串亂碼，此為 `SHEET_ID`。
3.  **設定 Google Apps Script**：
    * 在該試算表上方選單點擊 **「擴充功能」 -> 「Apps Script」**。
    * 刪除預設程式碼，將專案中的 `GAS 程式碼` 貼入。
    * 修改程式碼最上方的 `SHEET_ID` 與 `FOLDER_ID` 變數為您剛剛複製的 ID。
4.  **部署網頁應用程式**：
    * 點擊右上角 **「部署」 -> 「新增部署作業」**。
    * 類型選取 **「網頁應用程式」**。
    * 執行身分選擇 **「我」**；誰可以存取務必選擇 **「所有人」**（以便前端連線）。
    * 完成授權流程後，複製產生的 **「網頁應用程式網址 (Web App URL)」**。

### 第二步：前端網頁部署

由於前端為單一的靜態 `index.html` 檔案，您可以自由選擇以下任一免費平台進行託管：

* **GitHub Pages**：建立一個公開 Repository，上傳 `index.html`，並在 Settings -> Pages 中啟用部署。
* **Vercel**：將檔案放入資料夾，直接拖入 Vercel 儀表板進行 Manual Deploy。
* **Netlify**：使用 Netlify Drop 功能，將資料夾拖曳上傳即可秒級上傳。

### 第三步：綁定個人子網域 (Subdomain)

如果您擁有個人網域，想透過如 `emoji.yourdomain.com` 存取：
1.  在代管平台（如 Vercel/GitHub）的 **Domain 設定** 中新增您的子網域 `emoji.yourdomain.com`。
2.  登入您的網域註冊商（如 Cloudflare / GoDaddy），進入 DNS 管理面板。
3.  新增一筆 **CNAME** 紀錄：
    * **類型 (Type)**：`CNAME`
    * **名稱 (Name)**：`emoji`
    * **目標值 (Value)**：根據平台填入（例如 Vercel 填 `cname.vercel-dns.com`；GitHub 填 `你的帳號.github.io`）。

---

## 💡 使用說明

1.  **首次連線**：打開部署好的網頁網址，點擊右上角的 **齒輪 (設定) ⚙️**，將您在第一步取得的 Google Apps Script Web App URL 貼入並儲存。
2.  **快速上傳**：
    * 方法 A：點擊右上角「新增」，選取檔案並命名。
    * 方法 B：在任何地方截圖或複製圖片後，直接在網頁畫面上按下 `Ctrl+V`，即可自動觸發快捷上傳。
3.  **複製使用**：滑鼠移到想要使用的表情上（會顯示提示名稱），**滑鼠左鍵點擊一下**。當下方跳出「已成功複製圖片！」提示時，即可到 Discord 或其他軟體的輸入框直接 `Ctrl+V` 貼上使用。
4.  **管理刪除**：滑鼠懸停在表情卡片上時，右上角會出現隱藏的 `X` 按鈕，點擊並確認後即可將檔案移至雲端硬碟的垃圾桶，並同步清除試算表紀錄。

---

## ⚙️ 技術棧

* **Frontend**：HTML5, CSS3 (Tailwind CSS Via CDN), JavaScript (Vanilla JS ES6+)
* **Backend / Serverless**：Google Apps Script (GAS)
* **Database**：Google Sheets API
* **Storage**：Google Drive API (with `lh3.googleusercontent` CDN bypass)
* **Browser API**：Clipboard API (Async `write`), Canvas API (Image-to-Blob conversion)

---

## 📄 授權條款

本專案基於 MIT 授權條款開源，歡迎自由修改與再發布。
