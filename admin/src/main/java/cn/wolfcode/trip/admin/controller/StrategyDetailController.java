package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.domain.StrategyContent;
import cn.wolfcode.trip.base.domain.StrategyDetail;
import cn.wolfcode.trip.base.query.StrategyDetailQueryObject;
import cn.wolfcode.trip.base.service.IStrategyDetailService;
import cn.wolfcode.trip.base.service.IStrategyService;
import cn.wolfcode.trip.base.util.JsonResult;
import cn.wolfcode.trip.base.util.UploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/strategyDetail")
public class StrategyDetailController {

    @Autowired
    private IStrategyDetailService strategyDetailService;
    @Autowired
    private IStrategyService strategyService;


    @RequestMapping("/list")
    public String list(@ModelAttribute("qo") StrategyDetailQueryObject qo, Model model){
        model.addAttribute("pageInfo",strategyDetailService.query(qo));
        model.addAttribute("strategies",strategyService.listAll());
        return "strategyDetail/list";
    }

    @RequestMapping("/saveOrUpdate")
    @ResponseBody
    public JsonResult saveOrUpdate(StrategyDetail strategyDetail, MultipartFile file){
        if(file!=null && file.getSize()>0){
            //String uri = UploadUtil.upload(file, UploadUtil.PATH + "/upload");

            String url = UploadUtil.uploadQiniyun(file);
           // map.put("url",UploadUtil.Qi_PATH+url);

            strategyDetail.setCoverUrl(UploadUtil.Qi_PATH+url);
            //strategyDetail.setCoverUrl(uri);
        }
        strategyDetailService.saveOrUpdate(strategyDetail);
        return new JsonResult();
    }
    @RequestMapping("/getContentById")
    @ResponseBody
    public StrategyContent getContentById(Long id){
        return strategyDetailService.getContentById(id);
    }

}
