package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Sign;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SignMapper {

    int deleteByPrimaryKey(Long id);

    int insert(Sign record);

    Sign selectByPrimaryKey(Long id);

    List<Sign> selectAll();

    int updateByPrimaryKey(Sign record);

    List<Sign> selectByUserId(@Param("userId") Long userId);
}