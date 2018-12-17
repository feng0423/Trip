package cn.wolfcode.trip.base.service;


import cn.wolfcode.trip.base.domain.IntegraOrder;
import cn.wolfcode.trip.base.query.IntegraOrderQueryObject;
import com.github.pagehelper.PageInfo;

public interface IIntegraOrderService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(IntegraOrderQueryObject qo);
    /**
     * 新增和编辑
     * @param integraOrder
     */
    void saveOrUpdate(IntegraOrder integraOrder);

    /**
     * 删除订单
     */
    void delete(Long id);


    /**
     * 修改
     */
    void update(IntegraOrder integraOrder);
}
