package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.Sign;
import cn.wolfcode.trip.base.domain.User;
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
    public JsonResult saveOrUpdate(User user) {
        System.out.println(user);
        signService.saveSignInfo (user.getId());
        return new JsonResult();
    }
/*    @GetMapping
    public PageInfo queryStrategiesByRegionId(StrategyQueryObject qo) {
        //查询该地区的所有的状态为推荐的攻略(分页)
        qo.setPageSize(3);
        return regionService.query(qo);
    }*/
}
