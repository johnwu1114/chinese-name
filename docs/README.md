# 文件索引

## 1. 採用規範

- 結構依據：repo 文件與 agent 指引結構規範 1.4.0。
- 採用狀態：**遷移中**。已補齊七份必備文件。人工預覽與 Claude Code 互動 session 載入核對尚未完成，不宣稱完全符合。
- 查核日期：2026-11-19。版本與採用狀態屬本次查核的即時資訊。
- agent 載入實測（2026-11-19，啟動目錄為 repo 根目錄，新 session）：
  - Claude Code 2.1.328：以 `claude -p` 停用工具，要求逐字引用「必守規則」第一項，回覆與 `AGENTS.md` 原文一致，並指出檔案為根目錄 `AGENTS.md`。祖先目錄沒有 `CLAUDE.md`、`CLAUDE.local.md` 或 `.claude/CLAUDE.md`。互動 session 的載入訊息與 `/context` Memory files 尚未核對。
  - Codex CLI 0.170.0：`codex debug prompt-input` 的輸出含「AGENTS.md instructions for」本 repo 路徑，且 `AGENTS.md` 的專屬字串命中 1 次。
  - 其他 agent 未測。本 repo 沒有模組層 `AGENTS.md`。

## 2. 例外

目前沒有例外。

## 3. 路徑、用途與必讀時機

| 路徑 | 用途 | 何時必讀 |
| ---- | ---- | ---- |
| [README](../README.md) | 用途、範圍與如何開始 | 初次接觸 |
| [AGENTS](../AGENTS.md) | agent 規則與驗證入口 | agent 開始任務前 |
| [現況架構](architecture.md) | 模組、資料流與限制；含元件圖 | 修改架構、資料或外部整合前 |
| [工作流程](workflow.md) | 修改、驗證與交付；含流程圖 | 修改或交付前 |
| [慣例](conventions.md) | 檔名、程式分區、字形五行、文件與圖示 | 修改對應內容前 |
| [ADR 索引](adr/README.md) | 收錄門檻與核准流程 | 提案或翻轉重要決策前 |

歷史入口：[封存索引](archive/README.md) 列出已完成的計畫與需求，只供追溯，不列入任何任務的必讀清單。

一般任務不主動搜尋或讀取 `docs/adr/` 正文、`docs/archive/` 或已完成 ticket 工作紀錄。只有決策任務、使用者明確要求追溯，或現況文件指定依據時，才開必要的索引與單篇。現況資料不足時，先指出缺口，不自行用歷史補成事實。

引用維護時可比對歷史位置的路徑字串，僅讀定位片段。依工作流程封存時，可開啟並更新封存索引。不得把歷史過程改成現況。

## 4. 程式位置地圖

- 業務邏輯：`index.js`
- 狀態與列舉：`index.js`, `index.html`
- 畫面文字：`index.html`, `index.js`, `sancai.json`, `eighty-one.json`
- 入口：`index.html`, `index.js`
- 現況文件：`docs/architecture.md`, `docs/conventions.md`
- 備註：畫面載入的 JSON 來自 `API_URL`（GitHub Pages），不是 repo 根目錄的本地檔，見[現況架構](architecture.md#3-外部關係與資料流)。

先讀程式位置地圖，再搜尋指定路徑。找不到內容時改為搜尋整個 repo，並繼續排除歷史位置，不直接判定功能不存在。

## 5. 未完成項目

| 項目 | 目前狀態 | 完成條件 |
| ---- | ---- | ---- |
| 人工預覽 | 本次未執行 | 依工作流程檢查網頁操作與 Mermaid 實際渲染 |
| Claude Code 互動 session 載入核對 | 未執行 | 在 repo 根目錄開新互動 session，檢查載入訊息，並用 `/context` 確認 Memory files 含 `AGENTS.md` |
