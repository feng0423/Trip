package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.StrategyComment;
import cn.wolfcode.trip.base.query.StrategyCommentQueryObject;
import com.github.pagehelper.PageInfo;

public interface IStrategyCommentService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(StrategyCommentQueryObject  qo);
    /**
     * 新增
     * @param strategyComment
     * @return
     */
    void save(StrategyComment strategyComment,String[] tags);

    void changeState(Long id, Integer state);
}
