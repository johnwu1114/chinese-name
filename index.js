// ==================== 常數與設定 ====================

var API_URL = "https://johnwu1114.github.io/chinese-name/";
var QUALITY_THRESHOLD = 75;
var SANCAI_ELEMENTS = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];

var charDictionary;
var sancaiTable;
var eightyOneMap;
var baseDataReady = false;
var zodiacCache = {};
var zodiacRequests = {};
var zodiacRequestId = 0;

// ==================== 核心演算法 ====================

function findFamilyName(familyName) {
    if (!familyName || !charDictionary) return null;
    for (var i = 0; i < charDictionary.length; i++) {
        if (charDictionary[i].chars.indexOf(familyName) != -1) {
            return charDictionary[i];
        }
    }
    return null;
}

function getCombinations(familyName) {
    var family = findFamilyName(familyName);
    if (!family) return [];
    var topDrawCount = family.draw;
    var top5E = (topDrawCount + 1) % 10;

    var results = [];
    for (var key in sancaiTable) {
        if (Object.prototype.hasOwnProperty.call(sancaiTable, key)
         && key[0] == SANCAI_ELEMENTS[top5E] && sancaiTable[key].value >= 8) {
            for (var middleCount = topDrawCount + 1; middleCount <= topDrawCount + 26; middleCount++) {
                var middleFive = middleCount % 10;
                if (SANCAI_ELEMENTS[middleFive] == key[1]) {
                    var middleDrawCount = middleCount - topDrawCount;
                    for (var bottomCount = middleDrawCount + 1; bottomCount <= middleDrawCount + 26; bottomCount++) {
                        var bottomFive = bottomCount % 10;
                        if (SANCAI_ELEMENTS[bottomFive] == key[2]) {
                            var bottomDrawCount = bottomCount - middleDrawCount;

                            var topResult = eightyOneMap[topDrawCount + 1];
                            var middleResult = eightyOneMap[topDrawCount + middleDrawCount];
                            var bottomResult = eightyOneMap[middleDrawCount + bottomDrawCount];
                            var outResult = eightyOneMap[bottomDrawCount + 1];
                            var totalResult = eightyOneMap[topDrawCount + middleDrawCount + bottomDrawCount];
                            if (!topResult || !middleResult || !bottomResult || !outResult || !totalResult) continue;

                            var value = topResult.value;
                            value += middleResult.value;
                            value += bottomResult.value;
                            value += outResult.value;
                            value += totalResult.value;
                            value *= 2;
                            if (value >= Math.min(Math.max(0, QUALITY_THRESHOLD), 100)) {
                                results.push({
                                    "key": key,
                                    "value": value,
                                    "top": topDrawCount,
                                    "middle": middleDrawCount,
                                    "bottom": bottomDrawCount
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    return results;
}

// ==================== UI 渲染 ====================

function get5EColor(fiveEle) {
    switch (fiveEle) {
        case "木":
        case 1:
        case 2:
            return "<b style='color:green'>(木)</b>";
        case "火":
        case 3:
        case 4:
            return "<b style='color:red'>(火)</b>";
        case "土":
        case 5:
        case 6:
            return "<b style='color:brown'>(土)</b>";
        case "金":
        case 7:
        case 8:
            return "<b style='color:gold'>(金)</b>";
        case "水":
        case 0:
        case 9:
            return "<b style='color:blue'>(水)</b>";
        default:
            return "";
    }
}

function getWordsOf5E(chars, draw) {
    var arr = [];
    var seenChars = [];
    if (chars) {
        for (var i = 0; i < chars.length; i++) {
            if (seenChars.indexOf(chars[i]) != -1) continue;
            for (var j = 0; j < charDictionary.length; j++) {
                if (charDictionary[j].draw === draw && charDictionary[j].chars.indexOf(chars[i]) != -1) {
                    arr.push(chars[i] + get5EColor(charDictionary[j].fiveEle));
                    seenChars.push(chars[i]);
                    break;
                }
            }
        }
    }
    return arr.join(", ");
}

function renderResult(type, draw) {
    $("." + type + "DrawCount").text(draw);
    $("." + type + "5e").html(get5EColor((draw) % 10));
    $("." + type + "GoodOrbad").text(eightyOneMap[draw].text);
    $("." + type + "Content").text(eightyOneMap[draw].content);
}

function renderNameChars(index, draw, zodiacData) {
    $(".giveNameDrawCount" + index).text(draw);
    $(".giveName" + index + "_better").html(getWordsOf5E(zodiacData.better["_" + draw], draw));
    $(".giveName" + index + "_worse").html(getWordsOf5E(zodiacData.worse["_" + draw], draw));

    var normal = "";
    for (var j = 0; j < charDictionary.length; j++) {
        if (charDictionary[j].draw === draw) {
            var chars = charDictionary[j].chars;
            for (var i = 0; i < chars.length; i++) {
                if ((!zodiacData.better["_" + draw] || zodiacData.better["_" + draw].indexOf(chars[i]) == -1)
                 && (!zodiacData.worse["_" + draw] || zodiacData.worse["_" + draw].indexOf(chars[i]) == -1))
                    normal += chars[i];
            }
        }
    }
    $(".giveName" + index + "_normal").html(getWordsOf5E(normal, draw));
}

function clearNameChars() {
    $(".giveNameDrawCount1, .giveNameDrawCount2, .giveName1_better, .giveName1_worse, .giveName1_normal, .giveName2_better, .giveName2_worse, .giveName2_normal").empty();
}

function clearResults() {
    $(".sancai, .sancaiGoodOrbad, .sancaiContent").empty();
    var types = ["top", "middle", "bottom", "out", "total"];
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        $("." + type + "DrawCount, ." + type + "5e, ." + type + "GoodOrbad, ." + type + "Content").empty();
    }
    clearNameChars();
}

// ==================== 事件處理 ====================

function onFamilyNameChange() {
    if (!baseDataReady) return;
    zodiacRequestId++;
    clearResults();
    $("#combination").empty().append("<option value=''>請選擇</option>").val("");
    $(".familyName, .familyNameDrawCount").empty();
    $("#status").text("");

    var familyName = $.trim($("#familyName").val());
    if (familyName == "") return;
    var family = findFamilyName(familyName);
    if (!family) {
        $("#status").text("查無此姓氏");
        return;
    }
    $(".familyName").text(familyName).append(get5EColor(family.fiveEle));
    $(".familyNameDrawCount").text(family.draw);

    var results = getCombinations(familyName);

    results.sort(function (a, b) {
        if (a.value < b.value)
            return 1;
        if (a.value > b.value)
            return -1;
        if (a.middle > b.middle)
            return 1;
        if (a.middle < b.middle)
            return -1;
        if (a.bottom > b.bottom)
            return 1;
        if (a.bottom < b.bottom)
            return -1;

        return 0;
    });

    for (var i = 0; i < results.length; i++) {
        var item = results[i];
        var str = "適合筆畫: " + item.top + ", " + item.middle + ", " + item.bottom + " " + "(綜合分數:" + item.value + ")";
        $("#combination").append($("<option></option>").attr("value", JSON.stringify(item)).text(str));
    }
}

function onCombinationChange() {
    if (!baseDataReady) return;
    zodiacRequestId++;
    clearResults();
    $("#status").text("");
    if ($(this).val() == "") return;
    var val = JSON.parse($(this).val());

    $(".sancai").text(val.key);
    $(".sancaiGoodOrbad").text(sancaiTable[val.key].text);
    $(".sancaiContent").text(sancaiTable[val.key].content);

    renderResult("top", val.top + 1);
    renderResult("middle", val.top + val.middle);
    renderResult("bottom", val.middle + val.bottom);
    renderResult("out", val.bottom + 1);
    renderResult("total", val.top + val.middle + val.bottom);

    loadZodiacData(val);
}

function onZodiacChange() {
    if (!baseDataReady || $("#combination").val() == "") return;
    loadZodiacData(JSON.parse($("#combination").val()));
}

function loadZodiacData(combination) {
    var requestId = ++zodiacRequestId;
    var fileName = $("#zodiac").val() + ".json";
    clearNameChars();
    $("#status").text("");

    function renderCurrent(data) {
        if (requestId !== zodiacRequestId) return;
        renderNameChars(1, combination.middle, data);
        renderNameChars(2, combination.bottom, data);
    }

    if (Object.prototype.hasOwnProperty.call(zodiacCache, fileName)) {
        renderCurrent(zodiacCache[fileName]);
        return;
    }

    var request = zodiacRequests[fileName];
    if (!request) {
        request = $.getJSON(API_URL + fileName);
        zodiacRequests[fileName] = request;
        request.done(function (data) {
            zodiacCache[fileName] = data;
            delete zodiacRequests[fileName];
        }).fail(function () {
            delete zodiacRequests[fileName];
        });
    }
    request.done(renderCurrent).fail(function () {
        if (requestId !== zodiacRequestId) return;
        $("#status").text("生肖資料載入失敗，請重新選擇組合。");
    });
}

function onBtnDisplayClick() {
    if ($(this).text() == "顯示") {
        $(this).text("隱藏")
        $(this).closest("tr").find("span").removeClass("hide");
    } else {
        $(this).text("顯示")
        $(this).closest("tr").find("span").addClass("hide");
    }
}

// ==================== 初始化 ====================

$(function () {
    $("#familyName, #zodiac, #combination").prop("disabled", true);
    $("#status").text("資料載入中，請稍候。");
    $(this).on("change", "#familyName", onFamilyNameChange);
    $(this).on("change", "#combination", onCombinationChange);
    $(this).on("change", "#zodiac", onZodiacChange);
    $(this).on("click", ".btnDisplay", onBtnDisplayClick);
    // 表單只有一個文字欄位，按 Enter 會隱式送出並重新整理頁面
    $(this).on("submit", "form", function (e) { e.preventDefault(); });

    var dictionaryRequest = $.getJSON(API_URL + "chinese-characters.json", function (data) {
        charDictionary = data;
    });

    var sancaiRequest = $.getJSON(API_URL + "sancai.json", function (data) {
        sancaiTable = data;
    });

    var eightyOneRequest = $.getJSON(API_URL + "eighty-one.json", function (data) {
        eightyOneMap = {};
        for (var i = 0; i < data.length; i++) {
            eightyOneMap[data[i].draw] = data[i];
        }
    });

    $.when(dictionaryRequest, sancaiRequest, eightyOneRequest).done(function () {
        baseDataReady = true;
        $("#familyName, #zodiac, #combination").prop("disabled", false);
        $("#status").text("");
    }).fail(function () {
        $("#status").text("基礎資料載入失敗，請重新整理頁面。");
    });
});
