package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.Tickets;
import cn.wolfcode.trip.base.mapper.TicketsMapper;
import cn.wolfcode.trip.base.query.TicketsQueryObject;
import cn.wolfcode.trip.base.service.ITicketsService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketsServiceImpl implements ITicketsService {

    @Autowired
    private TicketsMapper ticketsMapper;

    /*查询所有数据
    * */
    public PageInfo query(TicketsQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize(),qo.getOrderBy());
        List list  = ticketsMapper.selectForList(qo);
        return new PageInfo(list);
    }

    public void saveOrUpdate(Tickets tickets) {
        if(tickets.getId()!=null){
            ticketsMapper.updateByPrimaryKey(tickets);
        }else{
            ticketsMapper.insert(tickets);
        }
    }
    /*
    删除订单
    * */
    public void delete(Long id) {
        ticketsMapper.deleteByPrimaryKey(id);
    }

    /**
     * 修改门票
     * @param tickets
     */
    public void update(Tickets tickets) {
        ticketsMapper.updateByPrimaryKey(tickets);
    }

    public Tickets get(Long id) {

        return ticketsMapper.selectByPrimaryKey(id);
    }
}
