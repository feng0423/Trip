package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.IntegraShopping;
import cn.wolfcode.trip.base.query.IntegraShoppingQueryObject;
import cn.wolfcode.trip.base.query.OrderQueryObject;
import cn.wolfcode.trip.base.query.QueryObject;

import java.util.List;

public interface IntegraShoppingMapper {
    int deleteByPrimaryKey(Long id);

    int insert(IntegraShopping record);

    IntegraShopping selectByPrimaryKey(Long id);

    List<IntegraShopping> selectAll();

    int updateByPrimaryKey(IntegraShopping record);

    /**
     * 查询积分商城的数据
     * @param qo
     * @return
     */
    List<IntegraShopping> selectForList(IntegraShoppingQueryObject qo);

}