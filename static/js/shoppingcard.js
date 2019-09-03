// 单选
$('.chooseStatue').on('click', function() {
    $(this).toggleClass('active')
    $('.chooseStatue').length === $('.chooseStatue.active').length ? 
    $('.getPrice_icon').addClass('active') :
    $('.getPrice_icon').removeClass('active')
    totalPrice()
})
// 全选
$('.getPrice_icon').on('click', function() {
    $(this).toggleClass('active')
    $(this).hasClass('active') ? $('.chooseStatue').addClass('active') : $('.chooseStatue').removeClass('active')
    totalPrice()
})
let flag = true
// 管理订单按钮
$('.manage_wrapper').on('click', function() {
    if(flag) {
        $('.getPrice_right').hide()
        $('.delete').show()
        $('.manage_pic').hide()
        $('.manage_txt').text('完成')
    }else {
        $('.getPrice_right').show()
        $('.delete').hide()
        $('.manage_pic').show()
        $('.manage_txt').text('管理')
    }
    flag = !flag
})
// 计算总价
function totalPrice() {
    let totalPrice = 0
    $('.chooseStatue.active').parent('.thing_template').each( (i, v) => {
        totalPrice += $(v).find('.Oneprice').text() * $(v).find('.Amount').val()
    })
    $('.Allprice').text(totalPrice)
}



// 累加器
(function($) {
	
	$.fn.Spinner = function (opts) {
	
		var defaults = {value:1, min:1, len:3, max:99}
		var options = $.extend(defaults, opts)
		var keyCodes = {up:38, down:40}
		return this.each(function() {
		
			var a = $('<a></a>'); f(a,0,"Decrease","-");	//加
			var c = $('<a></a>'); f(c,0,"Increase","+");	//减
			var b = $('<input/>');f(b,1,"Amount");cv(0);	//值
			
			$(this).append(a).append(b).append(c);
			a.click(function(){cv(-1);totalPrice()});
			b.keyup(function(){cv(0)});
			c.click(function(){cv(+1);totalPrice()});
			b.bind('keyup paste change',function(e){
				e.keyCode==keyCodes.up&&cv(+1);
				e.keyCode==keyCodes.down&&cv(-1);
			});
			
			function cv(n){
				b.val(b.val().replace(/[^\d]/g,''));
				bv=parseInt(b.val()||options.min)+n;
				bv>=options.min&&bv<=options.max&&b.val(bv);
				if(bv<=options.min){b.val(options.min);f(a,2,"DisDe","Decrease");}else{f(a,2,"Decrease","DisDe");}
				if(bv>=options.max){b.val(options.max);f(c,2,"DisIn","Increase");}else{f(c,2,"Increase","DisIn");}
			}
			
		});

		function f(o,t,c,s){
			t==0&&o.addClass(c).attr("href","javascript:void(0)").append("<i></i>").find("i").append(s);
			t==1&&o.addClass(c).attr({"value":options.value,"autocomplete":"off","maxlength":options.len});
			t==2&&o.addClass(c).removeClass(s);
		}
	}
	
})(jQuery);