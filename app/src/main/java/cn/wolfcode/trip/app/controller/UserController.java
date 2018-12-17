package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.SystemMessage;
import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.domain.*;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.service.ISystemMessageService;
import cn.wolfcode.trip.base.service.ITravelService;
import cn.wolfcode.trip.base.service.IUserService;
import cn.wolfcode.trip.base.query.UserQueryObject;
import cn.wolfcode.trip.base.service.*;
import cn.wolfcode.trip.base.util.JsonResult;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.*;
import jdk.nashorn.internal.objects.annotations.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import java.util.List;
import java.util.Map;

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
    private IStrategyCommentService strategyCommentService;
    @Autowired
    private IAttentionService attentionService;
    @Autowired
    private IUserStrategyService userStrategyService;
    @Autowired
    private IStrategyService strategyService;


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

    @GetMapping("/{UserId}")
    public User getUserById(@PathVariable Long UserId) {

        return userService.getUser(UserId);
    }
    @GetMapping("/{UserId}/travelsByUserId")
    public PageInfo travelByauthorId(UserQueryObject qo) {
        qo.setOrderBy("lastUpdateTime desc");
        return travelService.queryTravelByauthorId(qo);
    }


    @GetMapping("/{UserId}/strategycommentByUserId")
    public PageInfo queryStrategycommentsByUserId(UserQueryObject qo) {
        qo.setOrderBy("createTime desc");
        return strategyCommentService.queryStrategycommentsByUserId(qo);
    }
    //新增关注数
    @PostMapping("/{visitorId}/{authorId}")
    public JsonResult attention(@PathVariable Long visitorId , @PathVariable Long authorId) {
        attentionService.attention(visitorId,authorId);
        return new JsonResult();
    }
    //查看是否关注,
    @GetMapping("/{visitorId}/{authorId}")
    public Attention getAttention(@PathVariable Long visitorId , @PathVariable Long authorId) {
        return attentionService.gatAttention(visitorId,authorId);
    }

    //删除关注关联
    @PostMapping("/{visitorId}/{authorId}/delete")
    public JsonResult DeleteAttention(@PathVariable Long visitorId , @PathVariable Long authorId) {
        attentionService.DeleteAttention(visitorId,authorId);
        return new JsonResult();
    }



    //查询粉丝数量和关注数
    @GetMapping("/{userId}/attention")
    public Map<String,Object> get(@PathVariable Long userId) {
        return attentionService.selectAttentionByUserId(userId);

    }

    //查询是否有用户与游记记录
    @GetMapping("/{userId}/strategies/{strategyId}")
    public UserStrategy selectStrategiesByUserId(@PathVariable Long userId , @PathVariable Long strategyId) {

        UserStrategy userStrategy = userStrategyService.gatUserStrategy(userId, strategyId);

        return userStrategy;

    }
    //新增游记和用户关系
    @PostMapping("/{userId}/strategies/{strategyId}")
    public JsonResult saveStrategiesByUserId(@PathVariable Long userId ,@PathVariable Long strategyId ) {

        userStrategyService.saveUserStrategy(userId,strategyId);
        return new JsonResult();

    }

    //通过用户ID查询该用户收藏的游记
    @GetMapping("/{userId}/strategy")
    public List selectStrategiesByUserId(@PathVariable Long userId) {

        return strategyService.selectStrategyByUserId(userId);

    }


}
