package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Region;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RegionMapper {

    int deleteByPrimaryKey(Long id);

    int insert(Region record);

    Region selectByPrimaryKey(Long id);

    List<Region> selectAll(@Param("state") Integer state);

    int updateByPrimaryKey(Region record);

    List<Region> selectByParentId(@Param("parentId") Long parentId);

    void changeState(@Param("id") Long id, @Param("state") Integer state);
}