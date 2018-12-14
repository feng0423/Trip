package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Travel;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.query.UserQueryObject;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface TravelMapper {

    int deleteByPrimaryKey(Long id);

    int insert(Travel record);

    Travel selectByPrimaryKey(Long id);

    List<Travel> selectAll();

    int updateByPrimaryKey(Travel record);

    List selectForList(TravelQueryObject qo);

    void chageState(@Param("id") Long id, @Param("state") Integer state);

    List selectForListByUserId(UserQueryObject qo);
}