// ==================== 常數與設定 ====================

var API_URL = "https://johnwu1114.github.io/chinese-name/";
var QUALITY_THRESHOLD = 75;
var SANCAI_ELEMENTS = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];

var charDictionary;
var sancaiTable;
var eightyOneMap;
var selectedChars = [];

// ==================== 核心演算法 ====================

function getCombinations(familyName) {
    var topDrawCount = 0;
    var top5E = 0;

    for (var key in charDictionary) {
        if (charDictionary[key].chars.indexOf(familyName) != -1) {
            topDrawCount = charDictionary[key].draw;
            top5E = (topDrawCount + 1) % 10;
            $(".familyName").html(familyName + get5EColor(charDictionary[key].fiveEle));
            $(".familyNameDrawCount").html(topDrawCount);
            break;
        }
    }

    var results = [];
    for (var key in sancaiTable) {
        if (key[0] == SANCAI_ELEMENTS[top5E] && sancaiTable[key].value >= 8) {
            for (var middleCount = topDrawCount + 1; middleCount <= topDrawCount + 26; middleCount++) {
                var middleFive = middleCount % 10;
                if (SANCAI_ELEMENTS[middleFive] == key[1]) {
                    var middleDrawCount = middleCount - topDrawCount;
                    for (var bottomCount = middleDrawCount + 1; bottomCount <= middleDrawCount + 26; bottomCount++) {
                        var bottomFive = bottomCount % 10;
                        if (SANCAI_ELEMENTS[bottomFive] == key[2]) {
                            var bottomDrawCount = bottomCount - middleDrawCount;

                            var value = eightyOneMap[topDrawCount + 1].value;
                            value += eightyOneMap[topDrawCount + middleDrawCount].value;
                            value += eightyOneMap[middleDrawCount + bottomDrawCount].value;
                            value += eightyOneMap[bottomDrawCount + 1].value;
                            value += eightyOneMap[topDrawCount + middleDrawCount + bottomDrawCount].value;
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
    }
}

function getWordsOf5E(chars) {
    var arr = [];
    if (chars) {
        for (var i = 0; i < chars.length; i++) {
            for (var key in selectedChars) {
                if (selectedChars[key].chars.indexOf(chars[i]) != -1) {
                    arr.push(chars[i] + get5EColor(selectedChars[key].fiveEle));
                }
            }
        }
    }
    return arr.join(", ");
}

function renderResult(type, draw) {
    $("." + type + "DrawCount").html(draw);
    $("." + type + "5e").html(get5EColor((draw) % 10));
    $("." + type + "GoodOrbad").html(eightyOneMap[draw].text);
    $("." + type + "Content").html(eightyOneMap[draw].content);
}

function renderNameChars(index, draw, zodiacData) {
    $(".giveNameDrawCount" + index).html(draw);
    $(".giveName" + index + "_better").html(getWordsOf5E(zodiacData.better["_" + draw]));
    $(".giveName" + index + "_worse").html(getWordsOf5E(zodiacData.worse["_" + draw]));

    var normal = "";
    for (var key in charDictionary) {
        if (charDictionary[key].draw === draw) {
            var chars = charDictionary[key].chars;
            var i = chars.length;
            while (i--) {
                if ((!zodiacData.better["_" + draw] || zodiacData.better["_" + draw].indexOf(chars[i]) == -1)
                 && (!zodiacData.worse["_" + draw] || zodiacData.worse["_" + draw].indexOf(chars[i]) == -1))
                    normal += chars[i];
            }
        }
    }
    $(".giveName" + index + "_normal").html(getWordsOf5E(normal));
}

// ==================== 事件處理 ====================

function onFamilyNameChange() {
    if ($(this).val() == "") return;
    $("#combination").find("option").remove();
    $("#combination").append("<option value=''>請選擇</option>");

    var results = getCombinations($("#familyName").val());

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

        return -1;
    });

    for (key in results) {
        var item = results[key];
        var str = "適合筆畫: " + item.top + ", " + item.middle + ", " + item.bottom + " " + "(綜合分數:" + item.value + ")";
        $("#combination").append($("<option></option>").attr("value", JSON.stringify(item)).text(str));
    }
}

function onCombinationChange() {
    if ($(this).val() == "") return;
    var val = JSON.parse($(this).val());

    selectedChars = [];
    for (var key in charDictionary) {
        if (charDictionary[key].draw == val.middle
        || charDictionary[key].draw == val.bottom)
            selectedChars.push(charDictionary[key]);
    }

    $(".sancai").html(val.key);
    $(".sancaiGoodOrbad").html(sancaiTable[val.key].text);
    $(".sancaiContent").html(sancaiTable[val.key].content);

    renderResult("top", val.top + 1);
    renderResult("middle", val.top + val.middle);
    renderResult("bottom", val.middle + val.bottom);
    renderResult("out", val.bottom + 1);
    renderResult("total", val.top + val.middle + val.bottom);

    $.get(API_URL + $("#zodiac").val() + ".json", function (data) {
        renderNameChars(1, val.middle, data);
        renderNameChars(2, val.bottom, data);
    });
}

function onZodiacChange() {
    $("#familyName").trigger("change");
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
    $(this).on("change", "#familyName", onFamilyNameChange);
    $(this).on("change", "#combination", onCombinationChange);
    $(this).on("change", "#zodiac", onZodiacChange);
    $(this).on("click", ".btnDisplay", onBtnDisplayClick);

    $.get(API_URL + "chinese-characters.json", function (data) {
        charDictionary = data;
    });

    $.get(API_URL + "sancai.json", function (data) {
        sancaiTable = data;
    });

    $.get(API_URL + "eighty-one.json", function (data) {
        eightyOneMap = {};
        for (var key in data) {
            eightyOneMap[data[key].draw] = data[key];
        }
    });
});
