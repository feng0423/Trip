package cn.wolfcode.trip.app.controller;


import cn.wolfcode.trip.base.domain.IntegraShopping;
import cn.wolfcode.trip.base.query.IntegraShoppingQueryObject;
import cn.wolfcode.trip.base.service.IIntegraShoppingService;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/integraShopping")
public class IntegraShoppingController {

    @Autowired
    private IIntegraShoppingService integraShoppingService;

    @PostMapping
    @RequestMapping("/integraShoppingform")
    public JsonResult save(IntegraShopping integraShopping) {
        integraShoppingService.saveOrUpdate(integraShopping);
        return new JsonResult();
    }

    /**
     * 请求查询数据
     * @param qo
     * @return
     */
    @GetMapping
    public PageInfo query(IntegraShoppingQueryObject qo) {

        PageInfo query = integraShoppingService.query(qo);
        return query;
    }

}
