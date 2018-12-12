package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Travel;
import cn.wolfcode.trip.base.domain.TravelContent;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import com.github.pagehelper.PageInfo;

public interface ITravelService {

    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo queryForList(TravelQueryObject qo);
    /**
     * 新增和编辑
     * @param travel
     */
    void saveOrUpdate(Travel travel);
    /**
     * 根据id查询游记
     * @param id
     * @return
     */
    Travel getById(Long id);
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(TravelQueryObject qo);
    /**
     * 根据id查询游记内容
     * @param id
     * @return
     */
    TravelContent travelContentById(Long id);

    /**
     * 修改游记状态
     * @param id
     * @param state
     */
    void changeState(Long id, Integer state);
}
