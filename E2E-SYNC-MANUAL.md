# E2E 同步驗證手動步驟

在 **http://localhost:5500/index.html** 執行下列步驟，並記錄每步 **Pass/Fail**、紀錄名稱與任何 console/network 錯誤。

---

## 1) 開啟頁面並確認就緒

- 開啟 http://localhost:5500/index.html
- 確認「交易明細」表格與「新增紀錄」表單皆可見

**Pass / Fail:** _____

---

## 2) 新增一筆線上紀錄 A（名稱含時間戳）

- 在「項目名稱」輸入：`A_` + 時間戳（例如 `A_1739123456789`）
- 日期選今天、類型選「收入」、分類任選、金額填 `1`
- 點「新增紀錄」
- 確認該筆紀錄出現在交易明細中

**紀錄 A 名稱:** _____________________  
**Pass / Fail:** _____

---

## 3) 重新整理後 A 仍存在

- 按 F5 或重新整理頁面
- 確認同一筆紀錄 A 仍在列表中

**Pass / Fail:** _____

---

## 4) 清除 localStorage

- 按 F12 開啟開發者工具 → **Application**（或「應用程式」）
- 左側選 **Local Storage** → 選取你的網域（localhost:5500）
- 刪除以下三個 key：
  - `money-app-records-v1`
  - `money-app-categories-v1`
  - `money-app-projects-v1`

**Pass / Fail:** _____

---

## 5) 重新整理並確認 A 從雲端還原

- 重新整理頁面
- 等待約 2 秒（雲端載入）
- 確認紀錄 A 再次出現在列表中（由雲端還原）

**Pass / Fail:** _____

---

## 6) 離線流程

1. **切換離線**  
   - 開發者工具 → **Network**（網路）→ 勾選 **Offline**（離線），或從 Chrome 選單用「離線」模式
2. **新增一筆離線紀錄**  
   - 項目名稱：`B_OFFLINE_` + 時間戳（例如 `B_OFFLINE_1739123456789`）  
   - 日期、類型、分類、金額隨意（例如金額 1）→ 新增紀錄
3. **確認 B_OFFLINE 可見**  
   - 該筆紀錄應出現在列表中
4. **恢復連線**  
   - 取消 Offline / 離線
5. **等待約 5 秒**
6. **重新整理頁面**
7. **確認 B_OFFLINE 仍在列表中**

**紀錄 B_OFFLINE 名稱:** _____________________  
**Pass / Fail:** _____

---

## 7) 雲端還原強檢查

- 再次清除同三個 localStorage key：  
  `money-app-records-v1`、`money-app-categories-v1`、`money-app-projects-v1`
- 重新整理頁面
- 等待約 2 秒
- 確認 **A** 與 **B_OFFLINE** 兩筆紀錄都從雲端還原並顯示在列表中

**Pass / Fail:** _____

---

## 結果彙總

| 步驟 | Pass/Fail | 備註 |
|------|-----------|------|
| 1 | | |
| 2 | | 紀錄 A 名稱: |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | 紀錄 B_OFFLINE 名稱: |
| 7 | | |

**Console 錯誤（F12 → Console）：**  
（若有請貼上）

**Network 錯誤（F12 → Network，紅色失敗請求）：**  
（若有請貼上）
