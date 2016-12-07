//ref: http://www.dearmoney.classv.tw/name/result_babyname_free
var $quality = 40;
var $pickWords = [];
var $kangxi;
var $5EKey = ["水", "木", "木", "火", "火", "土", "土", "金", "金", "水"];
var $5E;
var $81;

$(function () {
    var topDrawCount = 0;
    var top5E = 0;

    $(this).on("change", "#familyName", function () {
        if ($(this).val() == "") return;
        $(".item").find("option").remove();
        $(".item").append("<option>請選擇</option>");

        for (var key in $kangxi) {
            if ($kangxi[key].words.indexOf($("#familyName").val()) != -1) {
                topDrawCount = $kangxi[key].draw;
                top5E = (topDrawCount + 1) % 10;
                $(".familyName").html($("#familyName").val());
                $(".familyNameDrawCount").html(topDrawCount);
                break;
            }
        }

        for (var key in $5E) {
            if (key[0] == $5EKey[top5E] && $5E[key].value >= 8) {
                for (var middleCount = topDrawCount + 1; middleCount <= topDrawCount + 26; middleCount++) {
                    var middleFive = middleCount % 10;
                    if ($5EKey[middleFive] == key[1]) {
                        var middleDrawCount = middleCount - topDrawCount;
                        for (var bottomCount = middleDrawCount + 1; bottomCount <= middleDrawCount + 26; bottomCount++) {
                            var bottomFive = bottomCount % 10;
                            if ($5EKey[bottomFive] == key[2]) {
                                var bottomDrawCount = bottomCount - middleDrawCount;

                                var value = $81[topDrawCount + 1].value;
                                value += $81[topDrawCount + middleDrawCount].value;
                                value += $81[middleDrawCount + bottomDrawCount].value;
                                value += $81[bottomDrawCount + 1].value;
                                value += $81[topDrawCount + middleDrawCount + bottomDrawCount].value;

                                if (value >= Math.min(Math.max(0, $quality), 50)) {
                                    var str = "適合筆畫: " + topDrawCount + ", " + middleDrawCount + ", " + bottomDrawCount + " "
                                    + "(" + key + " " + $5E[key].text + ")";
                                    $(".item").append($("<option></option>").attr("value", '{"middle":' + middleDrawCount + ', "bottom":' + bottomDrawCount + '}').text(str));
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    $(this).on("change", ".item", function () {
        var val = $.parseJSON($(this).val());

        $pickWords = [];
        for (var key in $kangxi) {
            if ($kangxi[key].draw == val.middle
            || $kangxi[key].draw == val.bottom)
                $pickWords.push($kangxi[key]);
        }

        $(".topFiveElement").html((topDrawCount + 1) + " " + get5EColor((topDrawCount + 1) % 10));
        $(".topContent").html(get81Content(topDrawCount + 1));

        $(".middleFiveElement").html((topDrawCount + val.middle) + " " + get5EColor((topDrawCount + val.middle) % 10));
        $(".middleContent").html(get81Content(topDrawCount + val.middle));

        $(".bottomFiveElement").html((val.middle + val.bottom) + " " + get5EColor((val.middle + val.bottom) % 10));
        $(".bottomContent").html(get81Content(val.middle + val.bottom));

        $(".outFiveElement").html((val.bottom + 1) + " " + get5EColor((val.bottom + 1) % 10));
        $(".outContent").html(get81Content(val.bottom + 1));

        $(".allFiveElement").html((topDrawCount + val.middle + val.bottom) + " " + get5EColor((topDrawCount + val.middle + val.bottom) % 10));
        $(".allContent").html(get81Content(topDrawCount + val.middle + val.bottom));

        $.get("https://johnwu1114.github.io/ChineseName/" + $("#zodiac").val() + ".json", function (data) {
            $(".giveNameDrawCount1").html(val.middle);
            $(".giveName1").html(getWordsOf5E(data.better["_" + val.middle]));

            $(".giveNameDrawCount2").html(val.bottom);
            $(".giveName2").html(getWordsOf5E(data.better["_" + val.bottom]));
        });
    });

    $.get("https://johnwu1114.github.io/ChineseName/KangXi.json", function (data) {
        $kangxi = data;
    });

    $.get("https://johnwu1114.github.io/ChineseName/FiveElements.json", function (data) {
        $5E = data;
    });

    $.get("https://johnwu1114.github.io/ChineseName/EightyOne.json", function (data) {
        $81 = {};
        for (var key in data) {
            $81[data[key].draw] = data[key];
        }
    });
});

function get81Content(draw) {
    return "<b>[" + $81[draw].text + "]</b> " + $81[draw].content;
}

function getWordsOf5E(words) {
    var str = "";
    if (words) {
        for (var i = 0; i < words.length; i++) {
            for (var key in $pickWords) {
                if ($pickWords[key].words.indexOf(words[i]) != -1) {
                    str += words[i] + get5EColor($pickWords[key].five) + ", ";
                }
            }
        }
    }
    return str;
}

function get5EColor(five) {
    switch (five) {
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
