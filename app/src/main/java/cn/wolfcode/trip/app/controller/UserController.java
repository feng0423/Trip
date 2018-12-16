package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.SystemMessage;
import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.service.ISystemMessageService;
import cn.wolfcode.trip.base.service.ITravelService;
import cn.wolfcode.trip.base.service.IUserService;
import cn.wolfcode.trip.base.util.JsonResult;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.*;
import jdk.nashorn.internal.objects.annotations.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users")
/**
 * 用户资源控制器
 */
@Api(value = "用户资源",description = "用户资源控制器")
public class UserController {

    @Autowired
    private IUserService userService;
    @Autowired
    private ITravelService travelService;

    @Autowired
    private ISystemMessageService systemMessageService;

    //需求一: 注册的实现
    @PostMapping
    @ApiOperation(value = "注册功能",notes = "其实就是新增用户")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "昵称",name = "nickName",dataType = "String",required = true),
            @ApiImplicitParam(value = "邮箱",name = "email",dataType = "String",required = true),
            @ApiImplicitParam(value = "密码",name = "password",dataType = "String",required = true)
    })
    public JsonResult register(User user) {
        JsonResult result = new JsonResult();
        try {
            userService.register(user);
        } catch (Exception e) {
            //这里捕获异常,如果有异常,说明邮箱已存在,将信息抛给用户看
            e.printStackTrace();
            result.mark(e.getMessage());
        }
        return result;
    }

    /**
     * 保存操作
     * 注意: 如果接收为单个的话需要加pathvarable,如果是对象的话则不用加
     *
     * @param user
     * @return
     */
    @PutMapping("/{id}")
    public JsonResult update(User user) {
        JsonResult result = new JsonResult();
        try {
            userService.update(user);
            result.setObj(user);
        } catch (Exception e) {
            e.printStackTrace();
            result.mark(e.getMessage());
        }
        return result;
    }


    @GetMapping("/{authorId}/travels")
    public PageInfo query(TravelQueryObject qo) {
        qo.setOrderBy("t.lastUpdateTime desc");
        return travelService.queryForList(qo);
    }

    /**
     * 王首恒
     * 查询系统消息显示在系统消息界面
     * @return
     */
    @GetMapping("/messages/systemMessage")
    public Object getSystemMessage() {
       /* User user = UserContext.getUser();*/
        List<SystemMessage> systemMessages = systemMessageService.selectAll();
        return systemMessages;
    }

    /**
     * 王首恒
     * 获取user数据展示到点赞界面
     * @return
     */
    @GetMapping("/messages/userlike")
    public Object getUserLike(){
        List<User> list = userService.selectAll();
        return list;
    }

    /**
     * 查询user的数据
     * @param qo
     * @return
     */
    @GetMapping("/{receiverId}")
    public User getUser( @PathVariable("receiverId") Long receiverId) {
        return userService.selectByUser(receiverId);
    }

}
