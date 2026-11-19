## Why

ChineseCharacters.json 的五行分類使用混合系統（部分依部首、部分依數理或字義），與字形五行標準不一致，抽樣 507 字有 ~18% 分類錯誤。JSON 檔案命名風格不統一（PascalCase 混 snake_case）。

## What Changes

- 依字形五行（部首歸類）校正 ChineseCharacters.json 中所有字元的五行屬性
- 統一 JSON 檔案命名為 kebab-case：
  - `ChineseCharacters.json` → `chinese-characters.json`
  - `EightyOne.json` → `eighty-one.json`
  - `Sancai.json` → `sancai.json`
  - `{N}_{animal}.json` → `{NN}-{animal}.json`（補零對齊，底線改連字號）
- 更新 index.js 和 index.html 中對應的檔案引用

## Capabilities

### New Capabilities

- `json-file-naming`: 統一 JSON 資料檔命名規範為 kebab-case
- `five-elements-correction`: 依字形五行標準校正字元五行分類

### Modified Capabilities

（無）

## Impact

- **ChineseCharacters.json** — 五行屬性欄位大量修改
- **所有 JSON 檔** — 檔名變更
- **index.js** — 更新 API_URL 引用的檔名
- **index.html** — 生肖 select 的 value 需對應新檔名
