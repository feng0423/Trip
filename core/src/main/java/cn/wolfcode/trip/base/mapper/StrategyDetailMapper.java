package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.StrategyDetail;
import cn.wolfcode.trip.base.query.QueryObject;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StrategyDetailMapper {
    int deleteByPrimaryKey(Long id);

    int insert(StrategyDetail record);

    StrategyDetail selectByPrimaryKey(Long id);

    List<StrategyDetail> selectAll();

    int updateByPrimaryKey(StrategyDetail record);

    //查询结果集
    List<StrategyDetail> selectForList(QueryObject qo); //查询结果集

    int getMaxSequence(@Param("catalogId") Long catalogId);


}