# structured-js-layout Specification

## Purpose
TBD - created by archiving change refactor-js. Update Purpose after archive.
## Requirements
### Requirement: 程式碼區塊分段
index.js SHALL 依以下順序組織為五個區塊：常數與設定、核心演算法、UI 渲染、事件處理、初始化。每個區塊 SHALL 以註解分隔線標示。

#### Scenario: 區塊順序正確
- **WHEN** 開啟 index.js
- **THEN** 由上至下依序為：常數與設定 → 核心演算法 → UI 渲染 → 事件處理 → 初始化

### Requirement: 消除名字渲染重複邏輯
名字第一字與第二字的渲染邏輯 SHALL 合併為單一共用函式 `renderNameChars(index, draw, zodiacData)`，以參數區分第一字（index=1）與第二字（index=2）。

#### Scenario: 第一字渲染
- **WHEN** 使用者選擇筆劃組合
- **THEN** `renderNameChars(1, val.middle, data)` 渲染喜用、不喜不忌、忌用字到對應的 `.giveName1_*` 元素

#### Scenario: 第二字渲染
- **WHEN** 使用者選擇筆劃組合
- **THEN** `renderNameChars(2, val.bottom, data)` 渲染喜用、不喜不忌、忌用字到對應的 `.giveName2_*` 元素

### Requirement: 變數重新命名
全域變數 SHALL 依以下對應重新命名：`$81` → `eightyOneMap`、`$quality` → `QUALITY_THRESHOLD`、`$api_url` → `API_URL`、`$sancaiKey` → `SANCAI_ELEMENTS`、`$pickWords` → `selectedChars`、`$chineseCharacters` → `charDictionary`、`$sancai` → `sancaiTable`。

#### Scenario: 無殘留舊變數名稱
- **WHEN** 在 index.js 中搜尋 `$81`、`$quality`、`$api_url`、`$sancaiKey`、`$pickWords`、`$chineseCharacters`、`$sancai`
- **THEN** 搜尋結果為零

### Requirement: 移除冗餘包裝函式
`get81Content(draw)` SHALL 被移除，其呼叫處 SHALL 直接替換為 `eightyOneMap[draw].content`。

#### Scenario: 函式不存在
- **WHEN** 在 index.js 中搜尋 `get81Content`
- **THEN** 搜尋結果為零

### Requirement: 功能行為不變
重構後的程式 SHALL 對相同輸入產生完全相同的 DOM 輸出。

#### Scenario: 相同輸入相同結果
- **WHEN** 輸入姓氏「陳」、生肖「雞」並選擇任一筆劃組合
- **THEN** 五格數值、三才結果、喜用/忌用/不喜不忌字列表與重構前完全一致

