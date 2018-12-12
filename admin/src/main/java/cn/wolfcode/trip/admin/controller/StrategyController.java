package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.domain.Region;
import cn.wolfcode.trip.base.domain.Strategy;
import cn.wolfcode.trip.base.query.StrategyQueryObject;
import cn.wolfcode.trip.base.service.IRegionService;
import cn.wolfcode.trip.base.service.IStrategyService;
import cn.wolfcode.trip.base.util.JsonResult;
import cn.wolfcode.trip.base.util.UploadUtil;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @Description:
 * @Author: Tank
 * @Date: 2018/12/9 15:59
 * @Version: 1.0
 */
@Controller
@RequestMapping("/strategy")
public class StrategyController {
    @Autowired
    private IStrategyService strategyService;
    @Autowired
    private IRegionService regionService;


    @RequestMapping("/saveOrUpdate")
    @ResponseBody
    public JsonResult saveOrUpdate(Strategy strategy, MultipartFile file) {
        //判断是否上传文件
        if(file!=null && file.getSize()>0){
            String url = UploadUtil.upload(file, UploadUtil.PATH+"/upload");
            System.out.println(url);
            strategy.setCoverUrl(url);
        }
        strategyService.saveOrUpdate(strategy);
        return new JsonResult();
    }


    @RequestMapping("/list")
    public String list(Model model, @ModelAttribute("qo") StrategyQueryObject qo) {
        PageInfo query = strategyService.query(qo);
        List<Region> regions = regionService.listAll(null);
        model.addAttribute("pageInfo",query);
        model.addAttribute("regions",regions);
        return "/strategy/list";
    }
}
