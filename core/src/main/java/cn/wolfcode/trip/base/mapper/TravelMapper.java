package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Travel;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.query.UserQueryObject;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface TravelMapper {

    int deleteByPrimaryKey(Long id);

    int insert(Travel record);

    Travel selectByPrimaryKey(Long id);

    List<Travel> selectAll();

    int updateByPrimaryKey(Travel record);

    List selectForList(TravelQueryObject qo);

    void chageState(@Param("id") Long id, @Param("state") Integer state);

    void insertLikeTravelUserRelation(@Param("travelId")Long travelId, @Param("userId")Long userId);
    void deleteLikeTravelUserRelation(@Param("travelId")Long travelId, @Param("userId")Long userId);

    Map selectLikeById(@Param("travelId")Long travelId, @Param("userId")Long userId);

    Map selectFavoriteById(@Param("travelId")Long travelId, @Param("userId")Long userId);

    void insertFavoriteTravelUserRelation(@Param("travelId")Long travelId, @Param("userId")Long userId);

    void deleteFavoriteTravelUserRelation(@Param("travelId")Long travelId, @Param("userId")Long userId);

    int countFavorites(Long travelId);
    int countLikes(Long travelId);

    List<Travel> selectByStatus(@Param("strategyId") Long strategyId, @Param("state") Integer state);
    List selectForListByUserId(UserQueryObject qo);
}