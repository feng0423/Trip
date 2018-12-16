package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.UserStrategy;
import cn.wolfcode.trip.base.mapper.UserStrategyMapper;
import cn.wolfcode.trip.base.service.IUserStrategyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserStrategyServiceImpl implements IUserStrategyService {

    @Autowired
    private UserStrategyMapper userStrategyMapper;


    public void saveUserStrategy(Long userId, Long strategyId) {
        UserStrategy us = new UserStrategy();
        us.setUserId(userId);
        us.setStrategyId(strategyId);
        userStrategyMapper.insert(us);
    }

    public UserStrategy gatUserStrategy(Long userId, Long strategyId) {
        return userStrategyMapper.selectRelation(userId,strategyId);
    }

    public void DeleteUserStrategy(Long userId, Long strategyId) {

    }
}
