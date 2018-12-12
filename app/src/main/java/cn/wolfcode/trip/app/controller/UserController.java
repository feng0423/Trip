package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.service.ITravelService;
import cn.wolfcode.trip.base.service.IUserService;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
/**
 * 用户资源控制器
 */
public class UserController {

    @Autowired
    private IUserService userService;
    @Autowired
    private ITravelService travelService;

    //需求一: 注册的实现
    @PostMapping
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
}
