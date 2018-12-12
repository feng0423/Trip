package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Region;

import java.util.List;

public interface IRegionService {

    /**
     * 根据上级地区查询
     * @param parentId
     * @return
     */
    List<Region> queryByParentId(Long parentId);

    void changeState(Region region);

    void saveOrUpdate(Region region);

    List<Region> listAll(Integer state);
}
