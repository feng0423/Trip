package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Travel;
import cn.wolfcode.trip.base.domain.TravelContent;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.Map;

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

    /**
     * 点赞或取消点赞
     * @param id
     * @param state true的话就插入值, false就delete记录
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
     * @param state
     */
    Map favorite(Long id);

    /**
     * 查询是否收藏了 返回null就没有收藏
     * @param id
     * @return
     */
    Map getFavoriteById(Long id);
}
