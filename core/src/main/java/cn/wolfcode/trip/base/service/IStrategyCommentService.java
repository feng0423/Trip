package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.StrategyComment;
import cn.wolfcode.trip.base.query.StrategyCommentQueryObject;
import cn.wolfcode.trip.base.query.UserQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

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

    List<StrategyComment> selectByStatus(Integer state);

    /**
     * 根据用户ID查询出所有该用户的评论
     * @param qo
     * @return
     */
    PageInfo queryStrategycommentsByUserId(UserQueryObject qo);
}
