package cn.wolfcode.trip.base.service.impl;



import cn.wolfcode.trip.base.domain.Order;
import cn.wolfcode.trip.base.domain.Tickets;
import cn.wolfcode.trip.base.mapper.OrderMapper;
import cn.wolfcode.trip.base.query.OrderQueryObject;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.service.IOrderService;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements IOrderService {

    @Autowired
    private OrderMapper orderMapper;

    /*查询订单所有数据
    * */
    public PageInfo query(OrderQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize(),qo.getOrderBy());
        List list  = orderMapper.selectForList(qo);
        return new PageInfo(list);
    }

    /**
     * 保存订单
     * @param order
     */
    public void saveOrUpdate(Order order) {
        if(order.getId()!=null){

            orderMapper.updateByPrimaryKey(order);
        }else{
            order.setUser(UserContext.getUser());//设置作者

            orderMapper.insert(order);
        }
    }

    /**
     * 删除订单
     * @param id
     */
    public void delete(Long id) {
        orderMapper.deleteByPrimaryKey(id);
    }

    /**
     * 修改订单
     * @param order
     */
    public void update(Order order) {
        orderMapper.updateByPrimaryKey(order);
    }

}
