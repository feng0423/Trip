package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.query.NewsQueryObject;
import cn.wolfcode.trip.base.service.INewsService;
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
@RequestMapping("/news")
public class NewsController {
    @Autowired
    private INewsService newsService;



    @RequestMapping("/saveOrUpdate")
    @ResponseBody
    public JsonResult saveOrUpdate(News news, MultipartFile file) {
        //判断是否上传文件
        if(file!=null && file.getSize()>0){
            String url = UploadUtil.upload(file, UploadUtil.Qi_PATH+"/upload");
            news.setCoverUrl(url);
        }
        newsService.saveOrUpdate(news);
        return new JsonResult();
    }


    @RequestMapping("/list")
    public String list(Model model, @ModelAttribute("qo") NewsQueryObject qo) {
        PageInfo query = newsService.query(qo);
        model.addAttribute("pageInfo",query);
        //model.addAttribute("regions",regions);
        return "/news/list";
    }

}
