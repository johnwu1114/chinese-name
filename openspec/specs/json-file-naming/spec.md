# json-file-naming Specification

## Purpose
TBD - created by archiving change fix-json-data. Update Purpose after archive.
## Requirements
### Requirement: JSON 檔案命名規範
所有 JSON 資料檔 SHALL 使用 kebab-case 命名。生肖檔 SHALL 使用兩位數字前綴（01-12）。

#### Scenario: 檔名格式正確
- **WHEN** 列出所有 JSON 檔案
- **THEN** 檔名皆為 kebab-case，無 PascalCase 或 snake_case

#### Scenario: 生肖檔排序一致
- **WHEN** 按檔名排序生肖 JSON
- **THEN** 順序為 01-rat 到 12-pig

### Requirement: 程式碼引用同步更新
index.js 和 index.html 中的 JSON 檔名引用 SHALL 對應新檔名。

#### Scenario: 程式碼無舊檔名
- **WHEN** 搜尋 index.js 和 index.html 中的 `ChineseCharacters.json`、`EightyOne.json`、`Sancai.json`、`_rat`、`_ox` 等舊名稱
- **THEN** 搜尋結果為零

