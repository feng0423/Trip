package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Tag;

import java.util.List;

public interface ITagService {

    List<Tag> listByStrategyId(Long strategyId);
}
