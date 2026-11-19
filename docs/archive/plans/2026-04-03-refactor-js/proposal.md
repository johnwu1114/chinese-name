## Why

index.js 將資料載入、核心演算法、DOM 操作、事件綁定全部混在 242 行中，且名字第一字與第二字的渲染邏輯幾乎完全重複。結構混亂導致維護困難，後續要校正資料或新增功能時風險高。

## What Changes

- 將 index.js 依關注點拆分為明確區塊：常數設定、資料載入、核心演算法、UI 渲染、事件綁定
- 抽取名字第一字/第二字的重複渲染邏輯為共用函式
- 移除無用的 `get81Content` 一行包裝函式
- 將 `$.parseJSON` 替換為原生 `JSON.parse`
- 改善全域變數命名（如 `$81` → 語意化名稱）

## Capabilities

### New Capabilities

- `structured-js-layout`: 將 index.js 組織為清楚的區塊結構，消除重複邏輯

### Modified Capabilities

（無）

## Impact

- **index.js** — 主要重構對象，邏輯不變，結構重組
- **index.html** — 不受影響（DOM class/id 不變）
- **JSON 資料檔** — 不受影響
- **外部依賴** — 維持 jQuery 2.1.1，無新增依賴
