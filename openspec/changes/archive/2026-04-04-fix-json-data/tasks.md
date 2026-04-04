## 1. 五行校正

- [x] 1.1 建立部首→五行對照表，用 Python 腳本批次校正 ChineseCharacters.json 的 fiveEle 值
- [x] 1.2 驗證校正結果：抽查氵、火、灬、日、土、山、石、木、艹、禾、金、釒、刂部字的五行歸類（142/142 正確）
- [x] 1.3 驗證字元總數不變（7,092 字）

## 2. 檔案重新命名

- [x] 2.1 重新命名 ChineseCharacters.json → chinese-characters.json
- [x] 2.2 重新命名 EightyOne.json → eighty-one.json
- [x] 2.3 重新命名 Sancai.json → sancai.json
- [x] 2.4 重新命名生肖 JSON（補零 + 底線改連字號）

## 3. 程式碼引用更新

- [x] 3.1 更新 index.js 中所有 JSON 檔名引用
- [x] 3.2 更新 index.html 中生肖 select 的 option value
- [x] 3.3 驗證無殘留舊檔名引用
