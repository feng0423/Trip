package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Strategy;
import cn.wolfcode.trip.base.query.StrategyQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface IStrategyService {

    PageInfo query(StrategyQueryObject qo);

    void saveOrUpdate(Strategy strategy);

    List listAll();

    Strategy getStrategyById(Long id);
}
