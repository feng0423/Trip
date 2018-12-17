package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.IntegraOrder;
import cn.wolfcode.trip.base.query.IntegraOrderQueryObject;
import cn.wolfcode.trip.base.query.IntegraShoppingQueryObject;

import java.util.List;

public interface IntegraOrderMapper {
    int deleteByPrimaryKey(Long id);

    int insert(IntegraOrder record);

    IntegraOrder selectByPrimaryKey(Long id);

    List<IntegraOrder> selectAll();

    int updateByPrimaryKey(IntegraOrder record);

    List<IntegraOrder> selectForList(IntegraOrderQueryObject qo);
}