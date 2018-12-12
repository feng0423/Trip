package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Travel;
import cn.wolfcode.trip.base.domain.TravelContent;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import com.github.pagehelper.PageInfo;

public interface ITravelService {

    PageInfo queryForList(TravelQueryObject qo);

    void saveOrUpdate(Travel travel);

    Travel getById(Long id);

    PageInfo query(TravelQueryObject qo);

    TravelContent travelContentById(Long id);

    void changeState(Long id, Integer state);
}
