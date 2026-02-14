# traffic_estimator

前端網址: https://xwjwpiy.github.io/traffic_estimator/frontend/

**聲明：此計算機結果僅供參考!!**

此計算機會將雙北公車間轉乘優惠納入考量

兩車間 60 分鐘內轉乘，且上下車都有刷卡，才可享轉乘優惠

優惠規則: 除普通公車轉普通公車，以及市民小巴/內科專車轉新北市普通公車，其餘轉法皆享後續路線第一段轉乘優惠

## 專案結構

```
traffic_estimator/
├── .github/workflows/          # CI/CD 自動化流程
│   ├── full_pipeline.yml       # 完整資料處理 pipeline（每日排程）
│   ├── update_data.yml         # 從 TDX API 下載公車資料
│   ├── merge_data.yml          # 合併台北市/新北市資料
│   └── process_routes.yml      # 處理路線與建立資料庫
│
├── frontend/                   # 前端（純 HTML/CSS/JS，GitHub Pages 部署）
│   ├── index.html              # 首頁
│   ├── fare-by-type.html       # 車種查詢頁面
│   ├── fare-by-type.js         # 車種查詢邏輯
│   ├── fare-by-line.html       # 路線查詢頁面
│   ├── fare-by-line.js         # 路線查詢邏輯
│   ├── route-stops.html        # 路線站牌查詢頁面
│   ├── route-stops.js          # 路線站牌查詢邏輯
│   ├── styles.css              # 全站樣式
│   ├── config.js               # API 設定（後端網址切換）
│   ├── nav.js                  # 導覽列元件
│   ├── utils.js                # 共用工具函式
│   └── script.js               # 首頁腳本
│
├── backend/                    # 後端（Python Flask，部署於 Render）
│   ├── app.py                  # Flask 主程式 & API 路由
│   ├── requirements.txt        # Python 套件依賴
│   ├── Procfile                # Render 部署設定（Gunicorn）
│   ├── debug_db.py             # 資料庫除錯工具
│   │
│   ├── functions/              # 資料處理模組
│   │   ├── update_data.py      # 從 TDX API 下載台北市/新北市公車資料
│   │   ├── merge_data.py       # 合併雙北公車路線與票價資料
│   │   ├── process_routes.py   # 路線資料預處理
│   │   ├── parse_buffer_zones.py   # 緩衝區段解析（判定分段點）
│   │   ├── convert_to_db.py    # 將 JSON 資料轉換為 SQLite 資料庫
│   │   └── unlock_db.py        # 資料庫鎖定排除工具
│   │
│   ├── data/                   # 資料目錄
│   │   ├── bus_data.db         # SQLite 資料庫（主要資料來源）
│   │   ├── taipei/             # 台北市原始資料
│   │   ├── newtaipei/          # 新北市原始資料
│   │   ├── merged/             # 合併後的 JSON 資料
│   │   ├── processed/          # 處理後的路線資料
│   │   └── static/             # 靜態設定檔
│   │       ├── bus_type_map.json               # 公車種類對照表
│   │       ├── bus_other_name.json             # 路線別名對照
│   │       ├── dual_terminal_routes.json       # 雙端點路線設定
│   │       ├── official_data_corrections.json  # 官方資料勘誤
│   │       └── special_turnaround_rules.json   # 特殊折返規則
│   │
│   └── tests/                  # 測試與驗證工具
│       ├── verify_routes_template.py   # 路線驗證範本
│       ├── enable_wal.py               # 啟用 WAL 模式
│       └── for_debug.py                # 除錯輔助
│
├── .gitignore
└── README.md
```

## 技術棧

| 層級 | 技術 |
|------|------|
| 前端 | HTML / CSS / JavaScript（部署於 GitHub Pages） |
| 後端 | Python Flask + Gunicorn（部署於 Render） |
| 資料庫 | SQLite（WAL 模式） |
| 資料來源 | TDX 運輸資料流通服務 API |
| CI/CD | GitHub Actions（每日自動更新資料） |

## 更新日誌

`v0.1.0` 2026/2/14 - 新增單一路線顯示沿線站牌，並可選擇上下車站估計搭乘段數

`v0.0.4` 2026/1/11 - 新增更新日誌、修改前端設計

`v0.0.3` 2025/8/30 - 可使用路線編號與段票數查詢搭乘的總費用

`v0.0.1` 2025/8/19 - 可使用車種與段票數查詢搭乘的總費用

## 規定來源

台北市部分: https://pto.gov.taipei/News_Content.aspx?n=6B4D38874E971F4B&sms=87415A8B9CE81B16&s=F62226B708551FBC

新北市部分(請選快速、跳蛙、跨區幹線公車轉乘優惠路線查看): https://www.traffic.ntpc.gov.tw/home.jsp?id=f06672ba2aadbd3c
