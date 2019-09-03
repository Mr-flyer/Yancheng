let latlngs = [
    new qq.maps.LatLng(32.990760, 120.808540),
    new qq.maps.LatLng(32.991500, 120.816450),
    new qq.maps.LatLng(32.986620, 120.815000),
    new qq.maps.LatLng(32.982962, 120.811500)
];
let zoubiao = [
    {x: 32.990760, y: 120.808540},
    {x: 32.991500, y: 120.816450},
    {x: 32.986620, y: 120.815000},
    {x: 32.982962, y: 120.811500}
]
let flag = true
window.onload = function () {
    let urlpath = new URLSearchParams(location.search)
    let ID = urlpath.get('id')
    // 获取本地存储的 景区坐标
    let {X, Y} = JSON.parse(localStorage.getItem('scenic_area_location'))
    var center = new qq.maps.LatLng(X, Y)
    // 2. 创建地图实例
    var map = new qq.maps.Map(
        document.getElementById("container"), {
            center: center,
            zoom: 20
        }
    );

    
    // 初始化检索驾车路线实例
    var drivingService = new qq.maps.DrivingService({
        map: map,
    });
    // 设置检索成功回调函数
    drivingService.setComplete(function (result) {
        if (result.type == qq.maps.ServiceResultType.MULTI_DESTINATION) {
            //alert("起终点不唯一");
            var d = result.detail;
            drivingService.search(d.start[0], d.end[0]);
        }
    });
    // 设置检索失败回调函数
    drivingService.setError(function (data) {
        alert(data);
    });

    // search(drivingService)

    $('body').on('click', '.cs', function () {
        let x = $(this).data('x'),
            y = $(this).data('y')
        let target = new qq.maps.LatLng(x, y)
        search(drivingService, target)
    })

    $.ajax({
        url: `${baseUrl}/api/v1/scenic/readbyareaid`,
        data: {
            id: ID,
        },
        success(res) {
            let {
                error_code,
                data
            } = res
            if (error_code == 0 && data.length) {
                console.log(data);
                let scenicSpotsArr = data.slice(0, 2).map((v, i) => {
                    let infoWin = new qq.maps.InfoWindow({
                        map: map,
                    });
                    createdMarker({
                        center: latlngs[i], // 坐标
                        map,
                        txt: v.scenic_name,
                        callback(marker) {
                            // if(flag) {
                                console.log('展示');
                                qq.maps.event.addListener(marker, 'click', function () {
                                    $('.popup').fadeIn(300)
                                    $('.title').text(v.scenic_name)
                                    $('.card_cont').text(v.scenic_content)
                                    $('.p_btn').attr('href', `../景区景点/voice_info.html?id=${v.id}`)
                                });
                            // }else {
                            //     console.log('路线');
                            //     qq.maps.event.addListener(marker, 'click', function () {
                            //         infoWin.open();
                            //         infoWin.setContent(`<div class="cs" data-x="${zoubiao[i].x}" data-y="${zoubiao[i].y}" style="z-index:10">导航</div>`);
                            //         infoWin.setPosition(latlngs[i]);
                            //     });
                            // }

                        }
                    })

                    return {
                        scenic_name: v.scenic_name, // 景点名称
                        scenic_coordinate: qq.maps.LatLng(v.scenic_lon, v.scenic_lat) // 景点坐标
                    }
                })
            }
        }
    })


}

$(".icon_close").on("click", function () {
    $('.popup').fadeOut(300)
})
// $('.tabbar_item').on('click', function() {
//     $(this).addClass('active').siblings().removeClass('active')
//     flag = $(this).find('span').text() == '景点'
//     console.log(flag);
// })
// 创建 `marker` 地图标注
function createdMarker({
    center,
    map,
    txt,
    callback
}) {
    // 3. 创建地图 标点实例
    let marker = new qq.maps.Marker({
        position: center,
        map: map,
    });

    // 3.2 自定义marker标记图像 
    let size = new qq.maps.Size(100, 30), // 图片容器尺寸 px -- 即可视区域
        origin = new qq.maps.Point(0, 0), // 切图坐标 默认(0, 0)
        anchor = null, // 锚点坐标 默认图片容器底部中心 ( x/2, y )
        scaleSize = new qq.maps.Size(30, 30), // 图片实际尺寸 px
        markerIcon = new qq.maps.MarkerImage(
            "../static/images/icon_locationMap.png",
            size,
            origin,
            anchor,
            scaleSize
        );

    marker.setIcon(markerIcon);
    callback(marker)
    createdLabel({center,txt,map})
}
// 创建 `label` 文字标签
function createdLabel({
    center,
    txt,
    map
}) {
    // 样式
    let style = {
        whiteSpace: 'normal',
        borderRadius: '8px',
        border: '1px solid rgba(153,153,153,1)',
        fontSize: '12px',
        lineHeight: '15px',
        color: 'rgba(153,153,153,1)',
        padding: '0 4px 0 14px',
        width: 'max-content',
        maxWidth: '80px',
        textOverflow: '-o-ellipsis-lastline',
        overflow: 'hidden',
        textOverflow: 'ellipsis', // 溢出文本省略号显示
        display: '-webkit-box',
        '-webkit-line-clamp': 2, // 限制块级元素文本行数
        /*! autoprefixer: off */
        '-webkit-box-orient': 'vertical', // 重置文本排列方式
        /* autoprefixer: on */
    };
    var label = new qq.maps.Label({
        //如果为true，表示可点击，默认true。
        clickable: true,

        //标签的文本。
        content: txt || '标记',

        //显示标签的地图。
        map: map,

        //相对于position位置偏移值，x方向向右偏移为正值，y方向向下偏移为正值，反之为负。
        offset: new qq.maps.Size(-40, -22),

        //标签位置坐标，若offset不设置，默认标签左上角对准该位置。
        position: center,

        //Label样式。
        style: style,

        //如果为true，表示标签可见，默认为true。
        visible: true,

        //标签的z轴高度，zIndex大的标签，显示在zIndex小的前面。
        zIndex: 0
    });
}
//设置搜索地点信息、驾车方案等属性
function search(drivingService, target) {
    var start = latlngs[3];
    var end = target || latlngs[1];
    // var policy = document.getElementById("policy").value;
    //设置驾车方案
    // drivingService.setPolicy(qq.maps.DrivingPolicy[policy]);
    //设置驾车的区域范围
    drivingService.setLocation("盐城");
    //设置驾驶路线的起点和终点
    drivingService.search(start, end);
}