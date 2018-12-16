package cn.wolfcode.trip.base.service;


import cn.wolfcode.trip.base.domain.Order;
import cn.wolfcode.trip.base.query.OrderQueryObject;
import cn.wolfcode.trip.base.query.QueryObject;
import com.github.pagehelper.PageInfo;

public interface IOrderService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(OrderQueryObject qo);
    /**
     * 新增和编辑
     * @param order
     */
    void saveOrUpdate(Order order);

    /**
     * 删除订单
     */
    void delete(Long id);


    /**
     * 修改
     */
    void update(Order order);
}
