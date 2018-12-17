package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Strategy;
import cn.wolfcode.trip.base.domain.StrategyComment;
import cn.wolfcode.trip.base.query.StrategyQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;

public interface IStrategyService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(StrategyQueryObject qo);
    /**
     * 新增和编辑
     * @param strategy
     */
    void saveOrUpdate(Strategy strategy);
    /**
     * 查询全部
     * @return
     */
    List<Strategy> listAll();
    /**
     * 根据id查询攻略
     * @param id
     * @return
     */
    Strategy getStrategyById(Long id);



    /**
     * 根据用户ID查询该用户所收藏的攻略
     * @param userId
     */
    List selectStrategyByUserId(Long userId);

    /**
     * 查询攻略查看最多的
     * @return
     */
    List listLook();

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

    /**
     * 收藏或取消收藏
     * @param id
     */
    Map favorite(Long id);

    /**
     * 查询是否收藏了 返回null就没有收藏
     * @param id
     * @return
     */
    Map getFavoriteById(Long id);

    /**
     * 在评论页面得到某条点评的数据
     * @param strategyCommentId
     * @return
     */
    StrategyComment getCommentById(Long strategyCommentId);


}
