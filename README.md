# 暖暖記帳 App（PWA）

這是一個可安裝到手機主畫面的繁體中文記帳 App（Progressive Web App）。

## 1) 本機啟動（不要直接雙擊 HTML）

請用本機伺服器開啟專案，避免 `file://` 導致 Service Worker 失效。

### 方式 A：Python

```bash
python -m http.server 5500
```

然後開啟：`http://localhost:5500/index.html`

### 方式 B：Node.js

```bash
npx serve . -l 5500
```

然後開啟：`http://localhost:5500/index.html`

## 2) 手機加入主畫面

1. 先把網站部署到可連線的 `https://` 網址（正式安裝建議用 HTTPS）。
2. 用手機瀏覽器開啟 `index.html`。
3. 在瀏覽器選單點「加入主畫面 / 安裝 App」。
4. 安裝後會以獨立 App 視窗開啟（非一般瀏覽器分頁）。

## 3) 已包含的 PWA 檔案

- `manifest.json`：App 名稱、主題色、圖示與啟動設定
- `service-worker.js`：快取核心資源，支援離線基本瀏覽
- `app-icon.svg`、`app-icon-maskable.svg`：主畫面圖示

## 4) 電腦與手機同步（Supabase）

若要讓電腦與手機共用同一份記帳資料，並支援離線時先存本機、有網路時自動上傳：

1. 到 [Supabase](https://supabase.com) 建立專案。
2. 在專案 **SQL Editor** 執行專案裡的 `supabase-setup.sql`，建立 `app_data` 表。
3. 到 **Settings → API** 複製 **Project URL** 與 **anon public** key。
4. 在 App 首頁點「雲端同步設定」，貼上 URL 與 anon key 後儲存。

之後每次開啟 App 會自動從雲端載入；新增或刪除紀錄、變更專案時會自動上傳。離線時會先存於本機，恢復連線後會自動上傳並拉取最新資料。多裝置以最後同步的為準。

## 5) 常見問題排查

- **看不到安裝選項**：確認是 `http://localhost`（本機）或 `https://`（遠端）。
- **改版後沒更新**：清除網站快取或在瀏覽器 DevTools 重新註冊 Service Worker。
- **圖示不顯示**：確認 `manifest.json` 與圖示檔案路徑存在且可讀取。
- **同步失敗**：確認 Supabase 專案已執行 `supabase-setup.sql`，且 RLS 政策允許 anon 讀寫。
