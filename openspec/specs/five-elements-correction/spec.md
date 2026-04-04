# five-elements-correction Specification

## Purpose
TBD - created by archiving change fix-json-data. Update Purpose after archive.
## Requirements
### Requirement: 字形五行分類標準
ChineseCharacters.json 中每個字元的 fiveEle 值 SHALL 依字形五行（部首歸類）判定。部首不在對照表中的字 SHALL 保留原值。

#### Scenario: 氵部字歸水
- **WHEN** 查詢含氵部首的字（如 江、河、湖、海、溫）
- **THEN** fiveEle 值皆為「水」

#### Scenario: 火灬日部字歸火
- **WHEN** 查詢含火、灬、日部首的字（如 炎、熙、明、晨）
- **THEN** fiveEle 值皆為「火」

#### Scenario: 土山石部字歸土
- **WHEN** 查詢含土、山、石部首的字（如 堅、塔、岳、峰）
- **THEN** fiveEle 值皆為「土」

#### Scenario: 木艹禾竹部字歸木
- **WHEN** 查詢含木、艹、禾、竹部首的字（如 林、草、秀、笑）
- **THEN** fiveEle 值皆為「木」

#### Scenario: 金釒刂部字歸金
- **WHEN** 查詢含金、釒、刂部首的字（如 鋒、鑫、利、劉）
- **THEN** fiveEle 值皆為「金」

### Requirement: 資料結構不變
校正後的 JSON SHALL 維持相同的資料結構（draw, fiveEle, chars 欄位），字元總數不變。

#### Scenario: 字元總數一致
- **WHEN** 計算校正前後所有 chars 字串的總字元數
- **THEN** 數量相同（7,092 字）

