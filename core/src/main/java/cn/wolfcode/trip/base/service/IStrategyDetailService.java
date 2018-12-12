package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.StrategyContent;
import cn.wolfcode.trip.base.domain.StrategyDetail;
import cn.wolfcode.trip.base.query.StrategyDetailQueryObject;
import com.github.pagehelper.PageInfo;

public interface IStrategyDetailService {

    PageInfo query(StrategyDetailQueryObject qo);

    void saveOrUpdate(StrategyDetail strategyDetail);

    StrategyContent getContentById(Long id);

    StrategyDetail getByDetailId(Long id);
}
