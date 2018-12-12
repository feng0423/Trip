package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Tag;

import java.util.List;

public interface ITagService {

    /**
     * 查询标签列表
     * @param strategyId
     * @return
     */
    List<Tag> listByStrategyId(Long strategyId);
}
