package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.StrategyQueryObject;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.service.IStrategyService;
import cn.wolfcode.trip.base.service.ITravelService;
import cn.wolfcode.trip.base.service.IUserService;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/searchs")
public class SearchController {

    @Autowired
    private IStrategyService strategyService;
    @Autowired
    private ITravelService travelService;
    @Autowired
    private IUserService userService;


    @GetMapping("/strategies")
    public PageInfo search1(StrategyQueryObject qo){
        return strategyService.query(qo);
    }
    @GetMapping("/travels")
    public PageInfo search2(TravelQueryObject qo){
        return travelService.query(qo);
    }
    @GetMapping("/users")
    public PageInfo search3(QueryObject qo){
        return userService.query(qo);
    }
}
