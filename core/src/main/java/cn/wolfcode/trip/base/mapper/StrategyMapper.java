package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Strategy;
import cn.wolfcode.trip.base.domain.StrategyDetail;
import cn.wolfcode.trip.base.query.QueryObject;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StrategyMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Strategy record);

    Strategy selectByPrimaryKey(Long id);

    List<Strategy> selectAll();

    int updateByPrimaryKey(Strategy record);

    //查询结果集
    List<Strategy> selectForList(QueryObject qo); //查询结果集


    List selectStrategyByUserId(Long userId);
}