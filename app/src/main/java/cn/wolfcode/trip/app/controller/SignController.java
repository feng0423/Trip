package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.Sign;
import cn.wolfcode.trip.base.service.ISignService;
import cn.wolfcode.trip.base.util.JsonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/signs")
public class SignController {

    @Autowired
    private ISignService signService;

    /**
     * 查询签到的时间
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public List<Sign> query(@PathVariable Long id){
         List<Sign> list= signService.getSignsByUserId(id);
        return list;
    }

    /**
     * 保存签到
     * @param
     * @return
     */
    @PostMapping
    public JsonResult saveOrUpdate(Sign sign) {
        signService.saveSignInfo (sign);
        return new JsonResult();
    }

    //查询用户当前签到的状态
    @GetMapping("/signCount/{id}")
    public int getState(@PathVariable Long id){
        return signService.selectUserState(id);
    }
    //查询用户的积分
    @GetMapping("/score/{id}")
    public int getScore(@PathVariable Long id){
        return signService.selectUserScore(id);
    }
}
