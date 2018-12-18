package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.StrategyComment;
import cn.wolfcode.trip.base.query.StrategyCommentQueryObject;
import cn.wolfcode.trip.base.query.UserQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;

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

    List<StrategyComment> selectCommentStrategy();


    /**
     * 点赞或取消点赞
     * @param id
     */
    Map like(Long id);

    /**
     * 查询是否点赞
     * @param id
     * @return
     */
    Map getLikeById(Long id);
}
