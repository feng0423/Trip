package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.Tag;
import cn.wolfcode.trip.base.mapper.TagMapper;
import cn.wolfcode.trip.base.service.ITagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagServiceImpl implements ITagService {

    @Autowired
    private TagMapper tagMapper;

    public List<Tag> listByStrategyId(Long  strategyId) {
        return tagMapper.selectByStrategyId(strategyId);
    }
}
