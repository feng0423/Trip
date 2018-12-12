package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.service.IUserService;
import cn.wolfcode.trip.base.util.JsonResult;
import cn.wolfcode.trip.base.util.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sessions")
/**
 * 会话资源控制器
 */
public class SessionController {

    @Autowired
    private IUserService userService;

    //需求二: 登录的实现
    @PostMapping
    public JsonResult login(String email,String password){
        JsonResult result = new JsonResult();
        try {
            //注意这里需要会user的对象,并将对象相应到前台,前台实现同标签账号密码都存在,但是需要在
            //JsonResult中多一个Object的对象
            User user = userService.login(email, password);
            //将user返回给前台
            result.setObj(user);
        } catch (Exception e) {
            //这里捕获异常,如果有异常,说明邮箱已存在,将信息抛给用户看
            e.printStackTrace();
            result.mark(e.getMessage());
        }
        return result;
    }
    //需求四:注销的实现
    @DeleteMapping
    public void logout(){
        UserContext.setUser(null);
    }

}
