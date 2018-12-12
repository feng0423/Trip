package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.StrategyCatalog;
import cn.wolfcode.trip.base.query.StrategyCatalogQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface IStrategyCatalogService {

    PageInfo query(StrategyCatalogQueryObject qo);

    void saveOrUpdate(StrategyCatalog strategyCatalog);

    List<StrategyCatalog> listByStrategyId(Long strategyId);

}
