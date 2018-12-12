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
    private IStrategyCommentService strategyCommendService;

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
    public PageInfo queryComment(StrategyCommentQueryObject qo) {
        qo.setOrderBy("sc.commendTime desc");
        return strategyCommendService.query(qo);
    }
   @PostMapping("/{strategy.id}/commends")
    public JsonResult saveComment(StrategyComment strategyComment,String[] tags ) {
       strategyCommentService.save(strategyComment,tags);
        return new JsonResult();
    }
}
