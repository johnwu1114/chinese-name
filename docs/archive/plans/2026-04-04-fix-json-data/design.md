## Context

ChineseCharacters.json 有 139 筆資料、7,092 個字元，每筆包含 draw（筆劃）、fiveEle（五行）、chars（字元字串）。現有五行分類為混合系統，需統一為字形五行。

JSON 檔名風格不一致：PascalCase（ChineseCharacters, EightyOne, Sancai）混 snake_case（1_rat, 2_ox）。

## Goals / Non-Goals

**Goals:**
- 依字形五行（部首→五行對照）校正所有字元的五行分類
- 統一 JSON 檔名為 kebab-case
- 更新程式碼中所有檔名引用

**Non-Goals:**
- 不校正筆劃數（抽查確認康熙筆劃已正確）
- 不新增或移除字元
- 不改變 JSON 資料結構
- 不改動生肖 JSON 的內容

## Decisions

### 1. 字形五行部首對照表

以部首判定五行，優先用外部部首（形符），無法判定時保留原值。

**金：** 金 釒 刂 刀 匕 戈 矛 辛 酉 斤
**木：** 木 艹 禾 竹 弓 耒
**水：** 氵 冫 水 雨 魚
**火：** 火 灬 日
**土：** 土 山 石 田

**判定流程：**
1. 查 Unicode CJK radical（康熙部首 U+2F00-U+2FD5）
2. 部首在對照表中 → 用對照表的五行
3. 部首不在對照表中 → 保留原有五行值（不強制變更）

**理由：** 部首對照表涵蓋取名常用字的主要部首。不在表中的字（如抽象字、罕用部首）難以用字形規則判定，保留原值比猜測好。

### 2. 使用 Python 腳本批次校正

用 unicodedata 和 CJK radical 資料庫取得每個字的部首，對照五行表後輸出新的 JSON。

### 3. 檔名對照

| 現有 | 新名 |
|---|---|
| `ChineseCharacters.json` | `chinese-characters.json` |
| `EightyOne.json` | `eighty-one.json` |
| `Sancai.json` | `sancai.json` |
| `1_rat.json` | `01-rat.json` |
| `2_ox.json` | `02-ox.json` |
| `3_tiger.json` | `03-tiger.json` |
| `4_rabbit.json` | `04-rabbit.json` |
| `5_dragon.json` | `05-dragon.json` |
| `6_snake.json` | `06-snake.json` |
| `7_horse.json` | `07-horse.json` |
| `8_goat.json` | `08-goat.json` |
| `9_monkey.json` | `09-monkey.json` |
| `10_rooster.json` | `10-rooster.json` |
| `11_dog.json` | `11-dog.json` |
| `12_pig.json` | `12-pig.json` |

### 4. 需更新的程式碼引用

- **index.js:** `API_URL + "ChineseCharacters.json"` → `"chinese-characters.json"`，以此類推
- **index.html:** `<option value="1_rat">` → `<option value="01-rat">`，以此類推

## Risks / Trade-offs

- **五行校正範圍有限** → 只有部首在對照表中的字會被校正，其餘保留原值。估計可覆蓋 60-70% 的字。
- **GitHub Pages 快取** → 改檔名後舊 URL 會 404，但這是 client-side app，使用者重新載入即可。
- **Unicode 部首資料不完整** → 部分字的 CJK radical 資訊可能缺失，用 fallback 處理。
