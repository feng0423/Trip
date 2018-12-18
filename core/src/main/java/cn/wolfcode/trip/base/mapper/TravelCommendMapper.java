package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.TravelCommend;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.TravelCommendQueryObject;

import java.util.List;

public interface TravelCommendMapper {

    int deleteByPrimaryKey(Long id);

    int insert(TravelCommend record);

    TravelCommend selectByPrimaryKey(Long id);

    List<TravelCommend> selectAll();

    int updateByPrimaryKey(TravelCommend record);

    //查询结果集
    List<TravelCommend> selectForList(QueryObject qo); //查询结果集

    //查询结果集
    List<TravelCommend> selectForAppList(TravelCommendQueryObject qo); //查询结果集

    List<TravelCommend> selectCommentTravel();
}