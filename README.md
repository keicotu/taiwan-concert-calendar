# 台灣音樂會日曆 (Taiwan Concert Calendar) 🎵

全台古典音樂盛事跨平台聚合平台，自動整合 **兩廳院 OPENTIX**、**MNA 牛耳藝術**、**寬宏藝術 (KHAM)** 與 **鴻觀/鴻宇藝術 (Pro Arts)** 的節目資訊。提供**月份列表視圖**與**月曆視圖**，支援手機/桌機響應式瀏覽、一鍵加入 Google Calendar 以及社群分享。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkeicotu%2Ftaiwan-concert-calendar)

---

## ✨ 核心特色

- 📅 **雙重視圖切換**：
  - **月份列表視圖 (List View)**：按月份分群（含節目縮圖、票價區間、主辦標籤、場次清單），特別優化手機直覺滑動。
  - **月曆網格視圖 (Calendar View)**：7x5 完整月曆，依照主辦單位色彩圓點標示（OPENTIX 藍、MNA 黃、寬宏 綠、鴻觀 紫），點擊即開展詳細卡片。
- 🔍 **多維度即時篩選**：支援主辦單位、演出城市（台北/台中/高雄/其他）、節目類型（交響樂/鋼琴/室內樂...）及關鍵字搜尋。
- 🎫 **官方購票跳轉**：直達 OPENTIX 或各主辦官方購票系統。
- 📲 **一鍵加入行事曆 & 社群分享**：支援自動帶入標題、場地與說明的 Google Calendar 深層連結，以及原生 Web Share API / 網址複製。
- 🤖 **Jamstack 零伺服器維護成本 ($0 / 月)**：
  - 由 GitHub Actions 每日清晨自動爬取最新節目並更新資料檔。
  - Vercel 全球邊緣節點 CDN 靜態託管（SSG）。

---

## 🏗️ 系統架構

```mermaid
flowchart LR
    A[每日定時排程\nGitHub Actions] -->|執行爬蟲| B[Python Scrapers\nOPENTIX & MNA]
    B -->|正規化輸出| C[src/data/concerts.json]
    C -->|Git Commit & Push| D[GitHub Repository]
    D -->|自動觸發部署| E[Vercel CDN]
    E -->|極速靜態呈現| F[終端使用者\n手機 / 電腦]
```

---

## 🚀 本地開發與執行

### 1. 安裝套件
```bash
yarn install
```

### 2. 執行爬蟲更新音樂會資料
```bash
python3 scripts/aggregate_all.py
```
> 爬蟲會即時擷取 OPENTIX 及 MNA 官方最新節目，並輸出至 `src/data/concerts.json`。

### 3. 啟動本地開發伺服器
```bash
yarn dev
```
打開瀏覽器瀏覽 [http://localhost:3000](http://localhost:3000)。

### 4. 正式打包與測試
```bash
yarn build
yarn start -p 3005
```

---

## ⏰ 自動化定時工作流 (GitHub Actions)

工作流程檔案位於 [`.github/workflows/scrape.yml`](.github/workflows/scrape.yml)：
- **自動觸發**：每天台灣時間清晨 04:00 (`cron: '0 20 * * *'`) 自動執行。
- **手動觸發**：可隨時至 GitHub 儲存庫的 **Actions** 分頁點擊 **Run workflow**。
- 自動偵測 `src/data/concerts.json` 變更並提交 commit，進而自動帶動 Vercel 重新打包部署。

---

## 🌐 部署至 Vercel

1. 前往 [Vercel 官網](https://vercel.com) 並以 GitHub 帳號登入。
2. 點擊 **Add New...** -> **Project**。
3. 匯入本儲存庫 `keicotu/taiwan-concert-calendar`。
4. Framework Preset 保持預設 `Next.js`，點擊 **Deploy**。
5. 1 分鐘內即可獲得專屬的免費線上網址（例如 `https://taiwan-concert-calendar.vercel.app`）！

---

## 📄 開源授權

MIT License.
