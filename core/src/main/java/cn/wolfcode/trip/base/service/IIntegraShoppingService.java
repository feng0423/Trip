package cn.wolfcode.trip.base.service;


import cn.wolfcode.trip.base.domain.IntegraShopping;
import cn.wolfcode.trip.base.query.IntegraShoppingQueryObject;
import com.github.pagehelper.PageInfo;

public interface IIntegraShoppingService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(IntegraShoppingQueryObject qo);
    /**
     * 新增和编辑
     * @param integraShopping
     */
    void saveOrUpdate(IntegraShopping integraShopping);

    /**
     * 删除订单
     */
    void delete(Long id);


    /**
     * 修改
     */
    void update(IntegraShopping integraShopping);

    /**
     * 查询对应id
     */
    IntegraShopping get(Long id);
}
