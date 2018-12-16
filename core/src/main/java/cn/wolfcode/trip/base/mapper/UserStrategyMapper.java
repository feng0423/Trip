package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.UserStrategy;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserStrategyMapper {
    int insert(UserStrategy record);

    List<UserStrategy> selectAll();

    UserStrategy selectRelation(@Param("userId") Long userId, @Param("strategyId") Long strategyId);

}