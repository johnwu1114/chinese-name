## 1. 變數重新命名

- [x] 1.1 將 `$api_url` 重新命名為 `API_URL`
- [x] 1.2 將 `$quality` 重新命名為 `QUALITY_THRESHOLD`
- [x] 1.3 將 `$sancaiKey` 重新命名為 `SANCAI_ELEMENTS`
- [x] 1.4 將 `$chineseCharacters` 重新命名為 `charDictionary`
- [x] 1.5 將 `$sancai` 重新命名為 `sancaiTable`
- [x] 1.6 將 `$81` 重新命名為 `eightyOneMap`
- [x] 1.7 將 `$pickWords` 重新命名為 `selectedChars`

## 2. 消除重複與冗餘

- [x] 2.1 抽取名字第一字/第二字的重複渲染邏輯為 `renderNameChars(index, draw, zodiacData)` 共用函式
- [x] 2.2 移除 `get81Content` 函式，將呼叫處替換為 `eightyOneMap[draw].content`
- [x] 2.3 將 `$.parseJSON` 替換為 `JSON.parse`

## 3. 區塊重組

- [x] 3.1 將常數與設定移至檔案頂部，加上區塊註解分隔線
- [x] 3.2 將核心演算法（`getCombinations`）移至常數區塊之後，加上分隔線
- [x] 3.3 將 UI 渲染函式（`renderResult`、`get5EColor`、`getWordsOf5E`、`renderNameChars`）移至演算法之後，加上分隔線
- [x] 3.4 將事件處理邏輯從 `$(function(){})` 中抽出為具名函式，加上分隔線
- [x] 3.5 將初始化邏輯（資料載入 + 事件綁定）集中至檔案底部的 `$(function(){})`，加上分隔線

## 4. 驗證

- [x] 4.1 確認 index.js 中無殘留舊變數名稱（`$81`、`$quality`、`$api_url`、`$sancaiKey`、`$pickWords`、`$chineseCharacters`、`$sancai`）
- [x] 4.2 確認 index.js 中無 `get81Content` 函式
- [x] 4.3 區塊順序驗證通過：常數與設定 → 核心演算法 → UI 渲染 → 事件處理 → 初始化
