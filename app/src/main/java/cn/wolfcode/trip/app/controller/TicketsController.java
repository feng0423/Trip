package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.Tickets;
import cn.wolfcode.trip.base.query.TicketsQueryObject;
import cn.wolfcode.trip.base.service.ITicketsService;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Type;
import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketsController {

    @Autowired
    private ITicketsService ticketsService;


    @PostMapping
    public JsonResult save(Tickets tickets) {
        ticketsService.saveOrUpdate(tickets);
        return new JsonResult();
    }

    @GetMapping

    public PageInfo query(TicketsQueryObject qo) {
        if(qo.getType()!=null) {
            if (qo.getType() == 1) {
                qo.setOrderBy("price desc");
            } else if (qo.getType()==2) {
                qo.setOrderBy("price asc");
            } else {
                qo.setOrderBy("price asc");
            }
        }
        PageInfo query = ticketsService.query(qo);
        return query;
    }

    @GetMapping("/{id}")
    public Tickets get(@PathVariable Long id) {
        Tickets ticketsId = ticketsService.get(id);
        return ticketsId;
    }
}
