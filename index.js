var $api_url = "https://johnwu1114.github.io/chinese-name/";
var $quality = 75;
var $pickWords = [];
var $chineseCharacters;
var $sancaiKey = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];
var $sancai;
var $81;

$(function () {
    $(this).on("change", "#familyName", function () {
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
           //var str = "適合筆畫: " + item.top + ", " + item.middle + ", " + item.bottom + " " + "(綜合分數:" + item.value + ")";
            var str = "適合筆畫: " + item.top + ", " + item.middle + ", " + item.bottom;
            $("#combination").append($("<option></option>").attr("value", JSON.stringify(item)).text(str));
        }
    });

    $(this).on("change", "#combination", function () {
        if ($(this).val() == "") return;
        var val = $.parseJSON($(this).val());

        $pickWords = [];
        for (var key in $chineseCharacters) {
            if ($chineseCharacters[key].draw == val.middle
            || $chineseCharacters[key].draw == val.bottom)
                $pickWords.push($chineseCharacters[key]);
        }
        var draw = 0;

        $(".sancai").html(val.key);
        $(".sancaiGoodOrbad").html($sancai[val.key].text);
        $(".sancaiContent").html($sancai[val.key].content);

        draw = val.top + 1;
        renderResult("top", draw);

        draw = val.top + val.middle;
        renderResult("middle", draw);

        draw = val.middle + val.bottom;
        renderResult("bottom", draw);

        draw = val.bottom + 1;
        renderResult("out", draw);

        draw = val.top + val.middle + val.bottom;
        renderResult("total", draw);

        $.get($api_url + $("#zodiac").val() + ".json", function (data) {
            $(".giveNameDrawCount1").html(val.middle);
            $(".giveName1_better").html(getWordsOf5E(data.better["_" + val.middle]));
            $(".giveName1_worse").html(getWordsOf5E(data.worse["_" + val.middle]));

            var normal = "";
            for (var key in $chineseCharacters) {
                if ($chineseCharacters[key].draw === val.middle) {
                    var chars = $chineseCharacters[key].chars;
                    var i = chars.length;
                    while (i--) {
                        if ((!data.better["_" + val.middle] || data.better["_" + val.middle].indexOf(chars[i]) == -1)
                         && (!data.worse["_" + val.middle] || data.worse["_" + val.middle].indexOf(chars[i]) == -1))
                            normal += chars[i];
                    }
                }
            }
            $(".giveName1_normal").html(getWordsOf5E(normal));


            $(".giveNameDrawCount2").html(val.bottom);
            $(".giveName2_better").html(getWordsOf5E(data.better["_" + val.bottom]));
            $(".giveName2_worse").html(getWordsOf5E(data.worse["_" + val.bottom]));
            var normal = "";
            for (var key in $chineseCharacters) {
                if ($chineseCharacters[key].draw === val.bottom) {
                    var chars = $chineseCharacters[key].chars;
                    var i = chars.length;
                    while (i--) {
                        if ((!data.better["_" + val.bottom] || data.better["_" + val.bottom].indexOf(chars[i]) == -1)
                         && (!data.worse["_" + val.bottom] || data.worse["_" + val.bottom].indexOf(chars[i]) == -1))
                            normal += chars[i];
                    }
                }
            }
            $(".giveName2_normal").html(getWordsOf5E(normal));
        });
    });

    $(this).on("change", "#zodiac", function () {
        $("#familyName").trigger("change");
    });

    $(this).on("click", ".btnDisplay", function () {
        if ($(this).text() == "顯示") {
            $(this).text("隱藏")
            $(this).closest("tr").find("span").removeClass("hide");
        } else {
            $(this).text("顯示")
            $(this).closest("tr").find("span").addClass("hide");
        }
    });

    $.get($api_url + "ChineseCharacters.json", function (data) {
    //$.get($api_url + "KangXi.json", function (data) {
        $chineseCharacters = data;
    });

    $.get($api_url + "Sancai.json", function (data) {
        $sancai = data;
    });

    $.get($api_url + "EightyOne.json", function (data) {
        $81 = {};
        for (var key in data) {
            $81[data[key].draw] = data[key];
        }
    });
});

function renderResult(type, draw) {
    $("." + type + "DrawCount").html(draw);
    $("." + type + "5e").html(get5EColor((draw) % 10));
    $("." + type + "GoodOrbad").html($81[draw].text);
    $("." + type + "Content").html(get81Content(draw));
}

function get81Content(draw) {
    return $81[draw].content;
}

function getWordsOf5E(chars) {
    var arr = [];
    if (chars) {
        for (var i = 0; i < chars.length; i++) {
            for (var key in $pickWords) {
                if ($pickWords[key].chars.indexOf(chars[i]) != -1) {
                    arr.push(chars[i] + get5EColor($pickWords[key].fiveEle));
                }
            }
        }
    }
    return arr.join(", ");
}

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

function getCombinations(familyName) {
    var topDrawCount = 0;
    var top5E = 0;

    for (var key in $chineseCharacters) {
        if ($chineseCharacters[key].chars.indexOf(familyName) != -1) {
            topDrawCount = $chineseCharacters[key].draw;
            top5E = (topDrawCount + 1) % 10;
            $(".familyName").html(familyName + get5EColor($chineseCharacters[key].fiveEle));
            $(".familyNameDrawCount").html(topDrawCount);
            break;
        }
    }

    var results = [];
    for (var key in $sancai) {
        if (key[0] == $sancaiKey[top5E] && $sancai[key].value >= 8) {
            for (var middleCount = topDrawCount + 1; middleCount <= topDrawCount + 26; middleCount++) {
                var middleFive = middleCount % 10;
                if ($sancaiKey[middleFive] == key[1]) {
                    var middleDrawCount = middleCount - topDrawCount;
                    for (var bottomCount = middleDrawCount + 1; bottomCount <= middleDrawCount + 26; bottomCount++) {
                        var bottomFive = bottomCount % 10;
                        if ($sancaiKey[bottomFive] == key[2]) {
                            var bottomDrawCount = bottomCount - middleDrawCount;

                            var value = $81[topDrawCount + 1].value;
                            value += $81[topDrawCount + middleDrawCount].value;
                            value += $81[middleDrawCount + bottomDrawCount].value;
                            value += $81[bottomDrawCount + 1].value;
                            value += $81[topDrawCount + middleDrawCount + bottomDrawCount].value;
                            value *= 2;
                            if (value >= Math.min(Math.max(0, $quality), 100)) {
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
