package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.Travel;
import cn.wolfcode.trip.base.query.TravelCommendQueryObject;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.service.ITravelCommendService;
import cn.wolfcode.trip.base.service.ITravelService;
import cn.wolfcode.trip.base.util.JsonResult;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/travels")
public class TravelController {

    @Autowired
    private ITravelService travelService;

    @Autowired
    private ITravelCommendService travelCommendService;

    @PostMapping
    public JsonResult save(Travel travel) {
        travelService.saveOrUpdate(travel);
        return new JsonResult();
    }

    @PutMapping("/{id}")
    public JsonResult update(Travel travel) {
        travelService.saveOrUpdate(travel);
        return new JsonResult();
    }

    @GetMapping("/{id}")
    public Travel getById(@PathVariable Long id) {

        return travelService.getById(id);
    }

    @GetMapping
    public PageInfo query(TravelQueryObject qo) {
        //已发布游记
        qo.setState(Travel.STATE_RELEASE);
        PageInfo query = travelService.query(qo);
        return query;
    }

    @GetMapping("/commends")
    public PageInfo listCommends(TravelCommendQueryObject qo) {
        qo.setOrderBy("tc.schedule desc");
        return travelCommendService.queryForList(qo);
    }


    @GetMapping("/{id}/likes/{state}")
    public JsonResult like(@PathVariable Long id, @PathVariable int state) {

        Map map;
        if (state == -1) {// 查询
            map = travelService.getLikeById(id);
        } else {// 插入或删除
            map = travelService.like(id);
        }

        return JsonResult.jsonResultWithMap(map);
    }


    @GetMapping("/{id}/favorites/{state}")
    public JsonResult favorite(@PathVariable Long id, @PathVariable int state) {

        Map map;
        if (state == -1) {// 查询
            map = travelService.getFavoriteById(id);
            // 如果页面取此值为null, 即当前没有收藏;反之有收藏
        } else {// 插入或删除
            map = travelService.favorite(id);
        }

        return JsonResult.jsonResultWithMap(map);
    }

    @GetMapping("/{id}/replies")
    public JsonResult reply(@PathVariable Long id) {
        return JsonResult.jsonResultWithMap(travelService.getReplyById(id));
    }

}
