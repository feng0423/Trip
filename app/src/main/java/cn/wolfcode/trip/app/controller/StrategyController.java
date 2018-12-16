package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.*;
import cn.wolfcode.trip.base.query.StrategyCommentQueryObject;
import cn.wolfcode.trip.base.query.StrategyQueryObject;
import cn.wolfcode.trip.base.service.*;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/strategies")
public class StrategyController {

    @Autowired
    private IStrategyService strategyService;
    @Autowired
    private IStrategyCatalogService strategyCatalogService;
    @Autowired
    private IStrategyDetailService strategyDetailService;
    @Autowired
    private ITravelService travelService;


    @Autowired
    private IStrategyCommentService strategyCommentService;
    @Autowired
    private ITagService tagService;


    @PostMapping
    public JsonResult save(Strategy strategy) {
        strategyService.saveOrUpdate(strategy);
        return new JsonResult();
    }

    @GetMapping
    public PageInfo query(StrategyQueryObject qo) {
        PageInfo query = strategyService.query(qo);
        return query;
    }

    @GetMapping("/{id}")
    public Strategy getStrategyById(@PathVariable Long id) {
        return strategyService.getStrategyById(id);
    }

    @GetMapping("/{id}/catalogs")
    public List<StrategyCatalog> listByStrategyId(@PathVariable Long id) {
        return strategyCatalogService.listByStrategyId(id);
    }
    @GetMapping("/{id}/tags")
    public List<Tag> listByyId(@PathVariable Long id) {
        return tagService.listByStrategyId(id);
    }

    @GetMapping("/details/{id}")
    public StrategyDetail getByDetailId(@PathVariable Long id) {
        return strategyDetailService.getByDetailId(id);
    }

   @GetMapping("/{strategyId}/commends")
    public PageInfo queryComments(StrategyCommentQueryObject qo) {
        qo.setOrderBy("sc.commendTime desc");
        return strategyCommentService.query(qo);
    }
   @PostMapping("/{strategy.id}/commends")
    public JsonResult saveComment(StrategyComment strategyComment,String[] tags ) {
       strategyCommentService.save(strategyComment,tags);
        return new JsonResult();
    }

    @GetMapping("/commends")
    public List<StrategyComment> getComment(Integer state) {
        return strategyCommentService.selectByStatus(state);
    }
   @GetMapping("/{strategyId}/travels")
    public List<Travel> getTravel(@PathVariable Long strategyId ,Integer state) {
        return travelService.selectByStatus(strategyId,state);
    }


    @GetMapping("/{id}/likes/{state}")
    public JsonResult like(@PathVariable Long id, @PathVariable int state) {

        Map map;
        if (state == -1) {// 查询
            map = strategyService.getLikeById(id);
        } else {// 插入或删除
            map = strategyService.like(id);
        }

        return JsonResult.jsonResultWithMap(map);
    }


    @GetMapping("/{id}/favorites/{state}")
    public JsonResult favorite(@PathVariable Long id, @PathVariable int state) {

        Map map;
        if (state == -1) {// 查询
            map = strategyService.getFavoriteById(id);
            // 如果页面取此值为null, 即当前没有收藏;反之有收藏
        } else {// 插入或删除
            map = strategyService.favorite(id);
        }

        return JsonResult.jsonResultWithMap(map);
    }
}
