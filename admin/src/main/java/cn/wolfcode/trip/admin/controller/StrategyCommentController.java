package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.query.StrategyCommentQueryObject;
import cn.wolfcode.trip.base.service.IStrategyCommentService;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/strategyComment")
public class StrategyCommentController {

    @Autowired
    private IStrategyCommentService strategyCommentService;


    @RequestMapping("/list")
    public String list(@ModelAttribute("qo") StrategyCommentQueryObject qo, Model model){
        PageInfo query = strategyCommentService.query(qo);
        model.addAttribute("pageInfo",query);
        return "strategyComment/list";
    }

    @RequestMapping("/changeState")
    @ResponseBody
    public JsonResult changeState(Long id ,Integer state){
        strategyCommentService.changeState(id,state);
        return new JsonResult();
    }
}
