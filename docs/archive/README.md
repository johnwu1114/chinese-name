# 封存索引

本目錄保存已完成的計畫與需求，只供歷史追溯。一般任務不主動讀取本目錄；只有使用者明確要求追溯，或現況文件指定依據時，才開必要的單篇。目前行為以現況文件為準。

| 日期 | 項目 | 狀態 | 內容 | 現況正本 |
| ---- | ---- | ---- | ---- | ---- |
| 2026-04-03 | [refactor-js](plans/2026-04-03-refactor-js/) | 已完成 | 重構 `index.js`：分區、共用名字渲染、全域變數改名 | [慣例：index.js 分區](../conventions.md#12-indexjs-分區)、[現況架構](../architecture.md#2-目錄與模組職責) |
| 2026-04-04 | [fix-json-data](plans/2026-04-04-fix-json-data/) | 已完成 | 校正字形五行，統一 JSON 檔名 | [慣例：JSON 檔名](../conventions.md#11-json-檔名)、[慣例：字形五行](../conventions.md#21-字形五行) |
| 2026-11-19 | [fix-js-bugs](plans/2026-11-19-fix-js-bugs.md) | 已完成 | 修正候選字筆劃錯位、載入與請求競態、查無姓氏、下游結果殘留等程式缺陷 | [現況架構](../architecture.md#2-目錄與模組職責)、[工作流程：人工預覽](../workflow.md#22-人工預覽步驟) |
| 2026-11-19 | [fix-data-junk](plans/2026-11-19-fix-data-junk.md) | 已完成 | 刪除字典零寬空白，三才孤立句併回「土金水」 | [慣例：字形五行](../conventions.md#21-字形五行)、[現況架構：資料檔](../architecture.md#4-資料檔與命名演算法) |
| 2026-11-19 | [kangxi-strokes](plans/2026-11-19-kangxi-strokes.md) | 已完成 | 字典與生肖表改用康熙筆劃，刪除簡體殘字；含待審清單 | [ADR 0001](../adr/0001-kangxi-stroke-standard.md)、[慣例：筆劃](../conventions.md#23-筆劃) |
| 2026-11-19 | [traditional-charset](plans/2026-11-19-traditional-charset.md) | 已完成 | 字庫以 Big5 正體為準：轉正體、刪非 Big5 字、補生肖缺字與大姓；含五行待審清單 | [ADR 0002](../adr/0002-traditional-charset.md)、[慣例：字庫範圍](../conventions.md#24-字庫範圍) |
| 2026-11-20 | [stroke-wuxing-verification](plans/2026-11-20-stroke-wuxing-verification.md) | 已完成 | 以康熙字典網上版全量校驗筆畫、兩個網站抽樣校驗五行；待審項經 codex 與 Gemini Argon 四輪討論；例外表加入搜與妍，訂出增刪門檻，3 字改五行 | [ADR 0001](../adr/0001-kangxi-stroke-standard.md)、[慣例：筆劃](../conventions.md#23-筆劃) |

2026-04-03 與 2026-04-04 兩項原本以 OpenSpec 格式記錄（proposal、design、tasks、specs）。2026-11-19 移除 OpenSpec 時原樣移入，內容未改寫；其中的 `openspec/` 路徑與 `/opsx:*` 指令已不存在。
