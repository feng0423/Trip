/*发送消息*/
function send(headUrl, str, time) {
    var html = "<div class='send'><div class=\"time\">" + time + "</div><div class='msg'><img src=" + headUrl + " />" +
        "<p><i class='msg_input'></i>" + str + "</p></div></div>";
    upView(html);
}

/*接受消息*/
function show(headUrl, str, time) {
    var html = "<div class='show'><div class=\"time\">" + time + "</div><div class='msg'><img src=" + headUrl + " />" +
        "<p><i class='msg_input'></i>" + str + "</p></div></div>";
    upView(html);
}

/*更新视图*/
function upView(html) {
    $('.message').append(html);
    $('body').animate({scrollTop: $('.message').outerHeight() - window.innerHeight}, 200)
}

function sj() {
    return parseInt(Math.random() * 10)
}

//格式化时间
function CurentTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var clock = year + "-";
    if (month < 10)
        clock += "0";
    clock += month + "-";
    if (day < 10)
        clock += "0";
    clock += day + " ";
    if (hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return clock;
}
//格式化时间
function CurentTimeWithSeconds(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var clock = year + "-";
    if (month < 10)
        clock += "0";
    clock += month + "-";
    if (day < 10)
        clock += "0";
    clock += day + " ";
    if (hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += "0";
    clock += ss;
    return clock;
}

//跳转到底部
function end() {
    var c = window.document.body.scrollHeight;
    window.scroll(0, c);
}

$(function () {
    $('.footer').on('keyup','input',function(){
        if($(this).val().length>0){
            $(this).next().css('background','#114F8E').prop('disabled',true);

        }else{
            $(this).next().css('background','#ddd').prop('disabled',false);
        }
    })

    //当前用户,即为发送者
    var senderId = JSON.parse(sessionStorage.getItem("user")).id;

    //接收者id
    var receiverId = getParams().receiverId;

    $.get("/users/"+receiverId,function (data) {
        $("#sendImg").attr("src",data.headImgUrl);
        $(".receiverName").html(data.nickName);
        $(".receiverData").click(function () {
            window.location.href="/userProfiles.html?id="+receiverId;
        });
    });

    //发送请求,通过发送者id和接受者id获取到两者之间的信息
    $.get("/userChats/"+senderId+"/"+receiverId+"/messages",function (data) {
        $.each(data,function (index,ele) {
            console.log(data);
            console.log(receiverId);
            //通过结果中发送者的id判断哪个是当前用户,是当前用户,就显示在右边
            if (ele.sender.id == senderId){
                $(".message").append('<div class="show">\n' +
                    '      <div class="time">'+ CurentTime(new Date(ele.sendTime))+'</div>\n' +
                    '      <div class="msg">\n' +
                    '        <img src="'+ele.sender.headImgUrl+'" width="40px" alt="" />\n' +
                    '        <p><i class="msg_input"></i>'+ele.message+'</p>\n' +
                    '      </div>\n' +
                    '    </div>');
            }else{
                $(".message").append('<div class="send">\n' +
                    '      <div class="time">'+CurentTime(new Date(ele.sendTime))+'</div>\n' +
                    '      <div class="msg">\n' +
                    '        <img src="'+ele.sender.headImgUrl+'" width="40px" alt="" />\n' +
                    '        <p><i class="msg_input"></i>'+ele.message+'</p>\n' +
                    '      </div>\n' +
                    '    </div>');
            }
        });
        end()
    });

    //给发送按钮绑定点击事件
    $("#sendBtn").click(function () {
        var message = $("[name='message']").val();
        if (message == ""){
            //如果没有信息,直接返回
            $(document).dialog({
                type : 'notice',
                content: '<span class="info-text">内容不能为空</span>',
                autoClose: 1000,
                position: 'bottom'
            });
            return;
        }
        $.ajax({
            url :"/userChats",
            data:{"sender.id":senderId,"receiver.id":receiverId,"message":message},
            type:"POST",
            success:function (data) {
                if (data.success){
                    location.reload();
                }
            }
        });
        //发送完后清空信息框内容
        $("[name='message']").val("");
        $("[name='message']").next().css('background', '#ddd').prop('disabled', false);
    });
    //查看这个页面的时候设置这条信息状态为已读状态
/*    $.ajax({
        type: "PUT",
        url: "/userChats/"+senderId+"/"+receiverId
    });*/
    var newTime = CurentTimeWithSeconds(new Date());
        function getNewMessage() {
        $.get("/userChats/" + receiverId + "/" + senderId + "/" + newTime, function (data) {
            console.log(data);
            if (data.length > 0) {
                $.each(data, function (index, ele) {
                    send(ele.sender.headImgUrl, ele.message, CurentTime(new Date(ele.sendTime)));
                });
                end();
            }
            //如果有新的消息,就刷新时间
            newTime = CurentTimeWithSeconds(new Date());
        });
    }
    window.setInterval(getNewMessage, 2000);
});
