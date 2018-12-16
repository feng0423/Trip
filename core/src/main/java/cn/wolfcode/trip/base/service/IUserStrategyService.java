package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.UserStrategy;

import java.util.Map;

public interface IUserStrategyService {

    /**
     * 新增用户与游记关联
     * @param userId
     * @param strategyId
     */
    void saveUserStrategy(Long userId, Long strategyId);

    /**
     * 通过关系查询是否关联
     * @param userId
     * @param strategyId
     * @return
     */
    UserStrategy gatUserStrategy(Long userId, Long strategyId);

    /**
     * 取消收藏,删除关系
     * @param userId
     * @param strategyId
     */
    void DeleteUserStrategy(Long userId, Long strategyId);


}
