package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Strategy;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.SerachQueryObject;
import cn.wolfcode.trip.base.query.StrategyQueryObject;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface StrategyMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Strategy record);

    Strategy selectByPrimaryKey(Long id);

    List<Strategy> selectAll();

    int updateByPrimaryKey(Strategy record);

    //查询结果集
    List<Strategy> selectForList(StrategyQueryObject qo); //查询结果集

    List<Strategy> selectSearchForList(SerachQueryObject qo);


    List selectStrategyByUserId(Long userId);


    int countLikes(Long id);

    int countFavorites(Long id);

    void insertLikeStrategyUserRelation(@Param("strategyId")Long strategyId, @Param("userId")Long userId);
    void deleteLikeStrategyUserRelation(@Param("strategyId")Long strategyId, @Param("userId")Long userId);

    Map selectLikeById(@Param("strategyId")Long strategyId, @Param("userId")Long userId);

    Map selectFavoriteById(@Param("strategyId")Long strategyId, @Param("userId")Long userId);

    void insertFavoriteStrategyUserRelation(@Param("strategyId")Long strategyId, @Param("userId")Long userId);

    void deleteFavoriteStrategyUserRelation(@Param("strategyId")Long strategyId, @Param("userId")Long userId);
}