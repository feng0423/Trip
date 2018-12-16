package cn.wolfcode.trip.app.controller;


import cn.wolfcode.trip.base.domain.Order;
import cn.wolfcode.trip.base.query.OrderQueryObject;
import cn.wolfcode.trip.base.service.IOrderService;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @PostMapping
    @RequestMapping("/orderform")
    public JsonResult save(Order order) {
        orderService.saveOrUpdate(order);
        return new JsonResult();
    }

    @GetMapping
    public PageInfo query(OrderQueryObject qo) {

        PageInfo query = orderService.query(qo);
        return query;
    }

}
