# 現況架構

## 1. 定位與啟動

chinese-name 是新生兒中文取名的純前端靜態網頁。使用者輸入單字姓氏、選擇生肖與筆劃組合，再查看候選字、三才及五格結果。它參考周易文字筆劃五行、十二生肖姓名學、81 數理姓名學及五行三才姓名學。

repo 沒有後端服務或建置步驟。可用瀏覽器開啟 `index.html`，或用 Python 靜態伺服器預覽。頁面仍須成功載入 jQuery 與遠端 JSON。人工預覽步驟見[工作流程](workflow.md#22-人工預覽步驟)。

## 2. 目錄與模組職責

| 路徑 | 職責 |
| ---- | ---- |
| `index.html` | 單頁表單與結果區。包含 CSS、生肖選項及畫面文字。載入 jQuery 2.1.1 CDN 與 `index.js`。 |
| `index.js` | 全部應用邏輯。包含常數、核心演算法、UI 渲染、事件處理及初始化。 |
| 根目錄 JSON | 字典、三才、81 數理與各生肖資料的本地版本。執行時使用的來源見第 3 節。 |
| `docs/` | 現況文件、索引與重要決策索引。 |
| `docs/archive/` | 已完成的計畫與需求，只供追溯。一般任務不讀封存正文。 |

| 函式 | 目前責任 |
| ---- | ---- |
| `findFamilyName(familyName)` | 查找姓氏的字典資料。輸入為空或查無姓氏時回傳 `null`。 |
| `getCombinations(familyName)` | 由姓氏字典筆劃、三才與 81 數理計算合格筆劃組合，不寫入 DOM。查無姓氏時回傳空陣列。任一格缺少 81 數理資料時略過該組合。 |
| `get5EColor(fiveEle)` | 將五行文字或尾數轉成五行色標 HTML。無對應值時回傳空字串。 |
| `getWordsOf5E(chars, draw)` | 只保留字典筆劃等於 `draw` 的字。每字只輸出一次，加上字形五行色標，再以「, 」串接。 |
| `renderResult(type, draw)` | 顯示指定五格的筆劃與五行色標，以純文字插入 81 數理評語及描述。 |
| `renderNameChars(index, draw, zodiacData)` | 共用第一字與第二字的候選字渲染。分為喜用、忌用與不喜不忌。不喜不忌字依字典原順序顯示。 |
| `clearNameChars()` | 清空兩字筆劃與三類候選字。 |
| `clearResults()` | 清空三才、五格與兩字候選區，保留姓氏與姓氏筆劃。 |
| `onFamilyNameChange()` | 使舊生肖回應失效，清空結果並重建組合選單。找到姓氏時更新姓氏、色標與筆劃，產生組合選項，依分數降序、中字及下字筆劃升序排列。查無姓氏時顯示訊息。 |
| `onCombinationChange()` | 使舊生肖回應失效並清空結果。選擇有效組合時更新三才與五格，以純文字插入三才評語及描述，再載入生肖資料並渲染兩字候選字。 |
| `onZodiacChange()` | 保留組合選單。已選組合時，依新生肖更新兩字候選字；未選組合時不動作。 |
| `loadZodiacData(combination)` | 遞增序號並清空候選區。以檔名快取已載入資料，共用同檔案的進行中請求。只讓最新序號的回應渲染候選字或顯示載入失敗訊息。 |
| `onBtnDisplayClick()` | 切換按鈕所在列（不喜不忌或生肖忌用）的顯示狀態。生肖喜用列固定顯示。 |

初始化綁定事件，並以 `$.getJSON` 分別請求字典、三才及 81 數理資料。81 數理資料載入後，以 `draw` 建立 `eightyOneMap`。三份資料全部成功後，才啟用姓氏、生肖與組合輸入。

## 3. 外部關係與資料流

```mermaid
flowchart TD
    user["使用者"] -->|"輸入姓氏、選生肖、選組合"| html["index.html：表單與結果區"]
    cdn["code.jquery.com：jQuery 2.1.1"] --> html
    html -->|"change 事件"| js["index.js：事件處理"]
    master["master 分支根目錄"] -->|"發佈"| remote["GitHub Pages：johnwu1114.github.io/chinese-name/"]
    js -->|"初始化：API_URL + 基礎 JSON"| remote
    remote --> base["字典、三才、81 數理"]
    base --> state["charDictionary、sancaiTable、eightyOneMap"]
    base -->|"全部成功"| ready["啟用三項輸入"]
    ready --> html
    base -->|"任一失敗"| error["顯示錯誤、維持停用"]
    error --> html
    js -->|"姓氏改變"| family["onFamilyNameChange：查姓氏、清空結果"]
    family --> calc["getCombinations：筆劃組合"]
    state --> calc
    family -->|"姓氏與筆劃、查無訊息"| html
    calc -->|"組合選項"| html
    js -->|"組合改變"| combo["onCombinationChange：三才、五格"]
    state --> combo
    combo --> loader["loadZodiacData：序號、快取"]
    js -->|"切換生肖且已選組合"| loader
    loader -->|"未快取：API_URL + 生肖 JSON，同檔案進行中則共用"| remote
    remote --> zodiac["選定生肖 JSON"]
    zodiac -->|"存入快取，最新序號才渲染"| render["renderNameChars：兩字候選字"]
    loader -->|"已快取"| render
    combo -->|"三才與五格"| html
    render --> html
```

圖說：初始化時，腳本從 `API_URL` 載入三份基礎資料。全部成功後才啟用輸入。使用者改變姓氏時，腳本清空結果並重建組合選單。使用者選擇組合時，腳本更新三才與五格，再載入選定生肖資料。切換生肖保留組合，只更新候選字。生肖資料以檔名快取，舊序號回應不更新畫面。`API_URL` 的內容由 `master` 分支發佈。圖中分組是資料職責，不代表額外服務。

`API_URL` 在程式內固定為 `https://johnwu1114.github.io/chinese-name/`。初始化及生肖查詢都將檔名接在此網址後方，不使用頁面所在目錄作為 JSON 來源。

因此，本機預覽也不讀取本地 JSON。資料修改要 push 到 `master`，並由 GitHub Pages 發佈後，才會反映在畫面上。發佈來源與查核日期見[工作流程](workflow.md#3-交付與發佈)。

jQuery 使用 HTTPS CDN URL。頁面初始停用姓氏、生肖與組合輸入，`#status` 顯示載入中訊息。三份基礎資料各自非同步載入，程式以 `$.when` 等待全部成功後才啟用輸入並清除訊息。任一失敗時，`#status` 顯示錯誤訊息，輸入維持停用。生肖資料也使用 `$.getJSON`。最新生肖請求失敗時，候選區保持清空，`#status` 提示重新選擇組合；重選組合會重新請求。

表單只有姓氏一個文字欄位，按 Enter 會觸發表單送出。程式攔截 `submit` 事件，避免頁面重新整理。姓氏輸入先去除前後空白再查字典。

## 4. 資料檔與命名演算法

| 本地檔案 | 資料結構與用途 |
| ---- | ---- |
| `chinese-characters.json` | 陣列。每筆含筆劃數 `draw`、字形五行 `fiveEle`、字元字串 `chars`。 |
| `sancai.json` | 物件。鍵為三元素組合，例如「水木木」。值含分數 `value`、評語 `text`、描述 `content`。 |
| `eighty-one.json` | 陣列。每筆含筆劃 `draw`、分數 `value`、評語 `text`、描述 `content`。 |
| `01-rat.json` 至 `12-pig.json` | 生肖物件。`type` 是生肖文字。`better`、`worse` 以 `_8` 等筆劃鍵對應字元陣列。 |

字典與生肖表的筆劃採康熙筆劃，規則見[慣例：筆劃](conventions.md#23-筆劃)。字典目前的筆劃範圍是 1 至 32 劃；超過 26 劃的字不會成為名字候選字，但可作為姓氏。

字典的字形五行與三才的筆劃尾數五行是不同用途。字形五行用於姓氏與候選字的色標；三才及五格計算使用筆劃尾數。

`SANCAI_ELEMENTS` 的索引 0 至 9 依序是水、木、木、火、火、土、土、金、金、水。`getCombinations` 先在字典中查姓氏筆劃，再以姓氏筆劃加一的尾數選天格五行。函式只考慮三才分數至少 8 的組合，並遍歷各為 1 至 26 劃的中字與下字。

設姓氏、中字、下字筆劃為 A、B、C，五格筆劃依序是天格 A+1、人格 A+B、地格 B+C、外格 C+1、總格 A+B+C。任一格在 `eightyOneMap` 查無資料時，程式略過該組合。將五格的 81 數理分數相加後乘 2，得到綜合分數。程式將 `QUALITY_THRESHOLD` 限制於 0 至 100，再保留達到門檻的組合；預設門檻是 75。

畫面輸入限制姓氏最多一個字。程式未提供複姓流程。字典查無姓氏時，程式顯示「查無此姓氏」，組合選單只保留空值的「請選擇」，並清空所有結果。找到姓氏時，程式清除訊息並更新姓氏與筆劃。姓氏改變或清空時，程式清空下游結果；清空姓氏也會清空姓氏與筆劃。組合選回「請選擇」時，程式清空三才、五格與兩字候選區。本文描述實作行為，不驗證姓名學的有效性。

## 5. 相關正本

修改流程見[工作流程](workflow.md)。命名、資料維護與分區規則見[慣例](conventions.md)。重要決策任務才開啟 [ADR 索引](adr/README.md)，並依閱讀限制查必要的單篇。
