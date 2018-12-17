package cn.wolfcode.trip.app.controller;


import cn.wolfcode.trip.base.domain.IntegraOrder;
import cn.wolfcode.trip.base.query.IntegraOrderQueryObject;
import cn.wolfcode.trip.base.query.IntegraShoppingQueryObject;
import cn.wolfcode.trip.base.service.IIntegraOrderService;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/integraOrder")
public class IntegraOrderController {

    @Autowired
    private IIntegraOrderService integraOrderService;

    @PostMapping
    @RequestMapping("/integraOrderform")
    public JsonResult save(IntegraOrder integraOrder) {
        integraOrderService.saveOrUpdate(integraOrder);
        return new JsonResult();
    }

    /**
     * 请求查询数据
     * @param qo
     * @return
     */
    @GetMapping
    public PageInfo query(IntegraOrderQueryObject qo) {

        PageInfo query = integraOrderService.query(qo);
        return query;
    }


}
