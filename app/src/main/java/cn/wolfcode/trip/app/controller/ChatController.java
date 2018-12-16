package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.SystemMessage;
import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.domain.UserChat;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.service.ISystemMessageService;
import cn.wolfcode.trip.base.service.ITravelService;
import cn.wolfcode.trip.base.service.IUserChatService;
import cn.wolfcode.trip.base.service.IUserService;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.eclipse.jetty.util.ajax.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import javax.xml.crypto.Data;
import java.time.chrono.ThaiBuddhistChronology;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/userChats")
/**
 * 用户聊天控制器
 */
public class ChatController {
    @Autowired
    private IUserService userService;
    @Autowired
    private IUserChatService userChatService;

    /**
     * 获取发送者和接收者的信息
     * @param senderId
     * @param receiverId
     * @return
     */
    @GetMapping("/{senderId}/{receiverId}/messages")
    public Object getUserChat( @PathVariable("senderId") Long senderId,@PathVariable("receiverId") Long receiverId){

        return userChatService.listUserById(senderId,receiverId);
    }


    /**
     * 获取聊天列表
     * @param receiverId
     * @return
     */
    @GetMapping("/{receiverId}")
    public List<User> getUserByreceiverId(@PathVariable Long receiverId){
        return userService.listUserById(receiverId);
    }

    /**
     * 点击发送按钮调的方法
     * @param senderId
     * @param receiverId
     * @return
     */
    @PostMapping
    public JsonResult getSend(UserChat userChat){
        userChatService.insert(userChat);
        return new JsonResult();
    }

    /**
     *
     * @param receiverId
     * @param senderId
     * @return
     */
    @GetMapping("/{receiverId}/{senderId}/{newTime}")
    public Object getNewMessage(@PathVariable Long senderId,
                                @PathVariable Long receiverId,
                                @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") String newTime){
        return userChatService.getNewMessage(senderId,receiverId,newTime);
    }


}
