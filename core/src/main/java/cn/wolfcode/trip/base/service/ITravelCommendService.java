package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.TravelCommend;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.TravelCommendQueryObject;
import com.github.pagehelper.PageInfo;

public interface ITravelCommendService {

    void saveOrUpdate(TravelCommend travelCommend);

    PageInfo query(QueryObject qo);

    PageInfo queryForList(TravelCommendQueryObject qo);
}
