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

## 4) 常見問題排查

- **看不到安裝選項**：確認是 `http://localhost`（本機）或 `https://`（遠端）。
- **改版後沒更新**：清除網站快取或在瀏覽器 DevTools 重新註冊 Service Worker。
- **圖示不顯示**：確認 `manifest.json` 與圖示檔案路徑存在且可讀取。
