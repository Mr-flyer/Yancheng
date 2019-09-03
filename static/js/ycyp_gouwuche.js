var allPrice = 0
    // 点击添加购物车
$(".chooseStatue").on("click", function() {
        $(this).toggleClass("active")
        if ($(this).hasClass("active")) {
            $(".Allprice").text(parseInt($(".Allprice").text()) + parseInt($(this).siblings(".thing_info").find(".Oneprice").text()) * parseInt($(this).siblings(".thing_info").find(".thing_Num").text()))
            $(".add_btn_nums").text(parseInt($(".add_btn_nums").text()) + 1)
        } else {
            if ($(".getPrice .getPrice_icon").hasClass("active")) {
                $(".getPrice .getPrice_icon").removeClass("active")
            }
            $(".Allprice").text(parseInt($(".Allprice").text()) - parseInt($(this).siblings(".thing_info").find(".Oneprice").text()) * parseInt($(this).siblings(".thing_info").find(".thing_Num").text()))
            $(".add_btn_nums").text(parseInt($(".add_btn_nums").text()) - 1)
        }
    })
    // 增加或减少
$(".min").on("click", function() {
    if (parseInt($(this).siblings(".thing_Num").text()) > 1) {
        $(this).siblings(".thing_Num").text(parseInt($(this).siblings(".thing_Num").text()) - 1)
            // 这是总件数
            // $(".add_btn_nums").text(parseInt($(".add_btn_nums").text()) - 1)
            // 这是总价格
        if ($(this).parents(".thing_info").siblings(".chooseStatue").hasClass("active")) {
            $(".Allprice").text(parseInt($(".Allprice").text()) - parseInt($(this).parent(".thing_Nums").prev(".info_price").children(".Oneprice").text()))
        }
    }
})
$(".add").on("click", function() {
        $(this).siblings(".thing_Num").text(parseInt($(this).siblings(".thing_Num").text()) + 1)
            // $(".add_btn_nums").text(parseInt($(".add_btn_nums").text()) + 1)
        if ($(this).parents(".thing_info").siblings(".chooseStatue").hasClass("active")) {
            $(".Allprice").text(parseInt($(".Allprice").text()) + parseInt($(this).parent(".thing_Nums").prev(".info_price").children(".Oneprice").text()))
        }
    })
    // 点击管理
$(".manage").on("click", function() {
        $(".getPrice").hide()
        $(".manage_thing").css("display", "flex")
        $(".manage_btn").text("完成")
    })
    // 购物车之后，全选选中删除购物车
$(".getPrice>.getPrice_left").on("click", function() {
        let choose = $(this).children(".getPrice_icon")
        choose.toggleClass("active")
        if ($(this).children(".getPrice_icon").hasClass("active")) {
            $(".chooseStatue").addClass("active")
            $(".add_btn_nums").text($(".thing_template").length)
        } else {
            $(".chooseStatue").removeClass("active")
            $(".thing_Num").text(1)
            $(".Allprice").text(0)
            $(".add_btn_nums").text(0)
        }
        getNums()
    })
    // 删除页面下的全选
$(".manage_thing>.getPrice_left").on("click", function() {
    let choose1 = $(this).children(".getPrice_icon")
    choose1.toggleClass("active")
    if (choose1.hasClass("active")) {
        $(".chooseStatue").addClass("active")
    } else {
        $(".chooseStatue").removeClass("active")
    }
})
$(".delete").on("click", function() {
    $(".chooseStatue.active").parent(".thing_template").remove()
    getNums()
})

function getNums() {
    let nums = $(".thing_template").length
    $(".thingNums").html(nums)
}

function clickAll() {
    if (!$(".thing_template:first").find(".chooseStatue").hasClass("active")) {
        $(".thing_template:first").find(".chooseStatue").click()
    }
}