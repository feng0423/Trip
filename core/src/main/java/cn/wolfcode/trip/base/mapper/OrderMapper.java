package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Order;
import cn.wolfcode.trip.base.domain.Tickets;
import cn.wolfcode.trip.base.query.QueryObject;

import java.util.List;

public interface OrderMapper {
    int insert(Order record);
    int updateByPrimaryKey(Order record);

    List<Order> selectAll();

    /*查询订单所有数据
     * */
    List<Order> selectForList(QueryObject qo);

    /**
     * 删除订单
     * @param id
     */
    void deleteByPrimaryKey(Long id);

    Order get(Long id);
}