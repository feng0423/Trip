package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.domain.Order;
import cn.wolfcode.trip.base.domain.Tickets;
import cn.wolfcode.trip.base.query.OrderQueryObject;
import cn.wolfcode.trip.base.query.TicketsQueryObject;
import cn.wolfcode.trip.base.service.IOrderService;
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
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @RequestMapping("/list")
    public String list(Model model, @ModelAttribute("qo") OrderQueryObject qo) {
        PageInfo query = orderService.query(qo);
        /* model.addAttribute("strategies",strategyService.listAll());*/
        model.addAttribute("pageInfo",query);
        return "/order/list";
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

            orderService.delete(id);
        }
        return result;
    }

    /**
     *  保存订单
     */
    //去新增或修改的页面
    @RequestMapping("/input")
    public String input(Order order){

        if(order.getId() != null){
            orderService.update(order);
        }
        return "/order/list";
    }

    @RequestMapping("/saveOrUpdate")
    @ResponseBody
    public JsonResult saveOrUpdate(Order order) {


        orderService.saveOrUpdate(order);
        return new JsonResult();
    }

}
