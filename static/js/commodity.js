$(".choose").on("click", function() {
    $(".mc").css("display", "flex")
    $(".thing_message").css("display", "flex")
    $(".commodity_container").css("height", "100vh")

})

$(".canshu").on("click", function() {
    $(".mc").css("display", "flex")
    $(".parameters").css("display", "flex")
    $(".commodity_container").css("height", "100vh")
})

$(".color_choose>div").on("click", function() {
    $(this).addClass("active").siblings().removeClass("active")
})

$(".size_choose>div").on("click", function() {
    $(this).addClass("active").siblings().removeClass("active")
})

$(".thing_message>.close").on("click", function() {
    $(".mc").css("display", "none")
    $(".thing_message").css("display", "none")
    $(".commodity_container").css("height", "auto")
    let num = $(".Amount").val() //数量
    let size = $(".size_choose>div.active").text() //获取尺码
    let color = $(".color_choose>div.active span").text() //获取颜色
    $(".choose_info").text("数量:" + num + "尺码:" + size + "颜色：" + color)
})
$(".parameters>.close").on("click", function() {
    $(".mc").css("display", "none")
    $(".parameters").css("display", "none")
    $(".commodity_container").css("height", "auto")
})