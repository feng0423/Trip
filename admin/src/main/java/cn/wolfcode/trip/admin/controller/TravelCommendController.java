package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.domain.TravelCommend;
import cn.wolfcode.trip.base.query.TravelCommendQueryObject;
import cn.wolfcode.trip.base.service.ITravelCommendService;
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

@Controller
@RequestMapping("/travelCommend")
public class TravelCommendController {
    @Autowired
    private ITravelCommendService travelCommendService;


    @RequestMapping("/saveOrUpdate")
    @ResponseBody
    public JsonResult saveOrUpdate(TravelCommend travelCommend, MultipartFile file) {
        if(file!=null && file.getSize()>0){
            String url = UploadUtil.upload(file, UploadUtil.PATH+"/upload");
            System.out.println(url);
            travelCommend.setCoverUrl(url);
        }
        travelCommendService.saveOrUpdate(travelCommend);
        return new JsonResult();
    }


    @RequestMapping("/list")
    public String list(Model model, @ModelAttribute("qo") TravelCommendQueryObject qo) {
        PageInfo query = travelCommendService.query(qo);
        model.addAttribute("pageInfo",query);
        return "/travelCommend/list";
    }
}
