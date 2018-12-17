package cn.wolfcode.trip.admin.controller;


import cn.wolfcode.trip.base.domain.Tickets;
import cn.wolfcode.trip.base.query.TicketsQueryObject;
import cn.wolfcode.trip.base.service.ITicketsService;
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
@RequestMapping("/tickets")
public class TicketsController {
    @Autowired
    private ITicketsService ticketsService;
    
    @RequestMapping("/saveOrUpdate")
    @ResponseBody
    public JsonResult saveOrUpdate(Tickets tickets, MultipartFile file) {

        //判断是否上传文件
        if(file!=null && file.getSize()>0){
            String url = UploadUtil.upload(file, UploadUtil.PATH+"/upload");
            System.out.println(url);
            tickets.setCoverurl(url);
        }

        ticketsService.saveOrUpdate(tickets);
        return new JsonResult();
    }


    @RequestMapping("/list")
    public String list(Model model, @ModelAttribute("qo") TicketsQueryObject qo) {
        PageInfo query = ticketsService.query(qo);
       /* model.addAttribute("strategies",strategyService.listAll());*/
        model.addAttribute("pageInfo",query);
        return "/tickets/list";
    }

    //去新增或修改的页面
    @RequestMapping("/input")
    public String input(Tickets tickets){

        if(tickets.getId() != null){
           ticketsService.update(tickets);
        }
        return "tickets/list";
    }

    /**
     * 删除订单
     * @param id
     * @return
     */
    @RequestMapping("/delete")
    @ResponseBody
    public JsonResult delete(Long id){
        //创建一个 JsonResult 对象
        JsonResult result =new JsonResult();
        if(id != null){

            ticketsService.delete(id);
        }
        return result;
    }
}
