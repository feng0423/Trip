package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.domain.StrategyCatalog;
import cn.wolfcode.trip.base.query.StrategyCatalogQueryObject;
import cn.wolfcode.trip.base.service.IStrategyCatalogService;
import cn.wolfcode.trip.base.service.IStrategyService;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
/**
 * @Author: Tank
 * @Date: 2018/12/9 15:30
 */
@Controller
@RequestMapping("/strategyCatalog")
public class StrategyCatalogController {
    @Autowired
    private IStrategyCatalogService strategyCatalogService;
    @Autowired
    private IStrategyService strategyService;



    @RequestMapping("/saveOrUpdate")
    @ResponseBody
    public JsonResult saveOrUpdate(StrategyCatalog strategyCatalog) {
        strategyCatalogService.saveOrUpdate(strategyCatalog);
        return new JsonResult();
    }


    @RequestMapping("/list")
    public String list(Model model, @ModelAttribute("qo") StrategyCatalogQueryObject qo) {
        PageInfo query = strategyCatalogService.query(qo);
        model.addAttribute("strategies",strategyService.listAll());
        model.addAttribute("pageInfo",query);
        return "/strategyCatalog/list";
    }

    /**
     * 获取大攻略下的攻略分类
     * @return
     */
    @RequestMapping("/listByStrategyId")
    @ResponseBody
    public List<StrategyCatalog> listByStrattegyId(Long strategyId) {
        List<StrategyCatalog> list= strategyCatalogService.listByStrategyId(strategyId);
        return list;
    }
}
