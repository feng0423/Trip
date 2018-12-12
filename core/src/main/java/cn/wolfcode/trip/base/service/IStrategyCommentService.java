package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.StrategyComment;
import cn.wolfcode.trip.base.query.StrategyCommentQueryObject;
import com.github.pagehelper.PageInfo;

public interface IStrategyCommentService {

    PageInfo query(StrategyCommentQueryObject  qo);

    void save(StrategyComment strategyComment,String[] tags);
}
