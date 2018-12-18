package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.Travel;
import cn.wolfcode.trip.base.domain.TravelContent;
import cn.wolfcode.trip.base.mapper.TravelContentMapper;
import cn.wolfcode.trip.base.mapper.TravelMapper;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.query.UserQueryObject;
import cn.wolfcode.trip.base.service.ITravelService;
import cn.wolfcode.trip.base.util.MapUtil;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TravelServiceImpl implements ITravelService{

    @Autowired
    private TravelMapper travelMapper;

    @Autowired
    private TravelContentMapper travelContentMapper;

    public PageInfo queryForList(TravelQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize(),qo.getOrderBy());
        List list  = travelMapper.selectForList(qo);
        return new PageInfo(list);
    }

    public void saveOrUpdate(Travel travel) {
        Date date = new Date();
        travel.setLastUpdateTime(date);//最后更新时间

        if(travel.getId() != null){
            //更新游记表
            travelMapper.updateByPrimaryKey(travel);

            //更新游记内容表
            TravelContent travelContent = travel.getTravelContent();
            travelContent.setId(travel.getId());
            travelContentMapper.updateByPrimaryKey(travelContent);
        }else {
            //保存游记表
            travel.setAuthor(UserContext.getUser());//设置作者
            travel.setCreateTime(date);//创建时间
            travelMapper.insert(travel);

            //保存游记内容表
            TravelContent travelContent = travel.getTravelContent();
            travelContent.setId(travel.getId());
            travelContentMapper.insert(travelContent);
        }
    }

    public Travel getById(Long id) {
        return travelMapper.selectByPrimaryKey(id);
    }

    public PageInfo query(TravelQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List list = travelMapper.selectForList(qo);
        return new PageInfo(list);
    }

    public TravelContent travelContentById(Long id) {
        return travelContentMapper.selectByPrimaryKey(id);
    }

    public void changeState(Long id, Integer state) {
        travelMapper.chageState(id,state);
    }

    public Map like(Long id) {
        if (!UserContext.isLogined())
            return null;
        Long userId = UserContext.getUser().getId();
        Map map = new HashMap();
        if (userId !=null){

            Map mapSelect = travelMapper.selectLikeById(id, userId);
            if (mapSelect==null) {
                travelMapper.insertLikeTravelUserRelation(id, userId);
                map.put("hasClick",true);
            }else {
                travelMapper.deleteLikeTravelUserRelation(id, userId);
                map.put("hasClick",false);
            }
        }



        map.put("count",travelMapper.countLikes(id));

        return map;
    }


    public Map favorite(Long id) {
        if (!UserContext.isLogined())
            return null;
        Long userId = UserContext.getUser().getId();

        Map map = new HashMap();
        if (userId !=null){
            Map mapSelect = travelMapper.selectFavoriteById(id, userId);
            if (mapSelect==null) {
                travelMapper.insertFavoriteTravelUserRelation(id, userId);
                map.put("hasClick",true);
            }else {
                travelMapper.deleteFavoriteTravelUserRelation(id, userId);
                map.put("hasClick",false);
            }
        }

        map.put("count",travelMapper.countFavorites(id));

        return map;
    }


    public Map getLikeById(Long id) {
        return getCommonMap(id, travelMapper.countLikes(id),1);
    }

    public Map getFavoriteById(Long id) {
        return getCommonMap(id, travelMapper.countFavorites(id),2);
    }

    public Map getReplyById(Long id) {
        return getCommonMap(id, travelMapper.countReplies(id),3);
    }


    public Map getCommonMap(Long id, int count, int type) {
        Map map;
        if (!UserContext.isLogined()) {
            map = MapUtil.getNewMap(null);
            map.put("count",count);
            return map;
        }

        Long userId = UserContext.getUser().getId();

        switch (type){
            case 1: // like
                map = MapUtil.getNewMap(travelMapper.selectLikeById(id, userId));
                break;
            case 2: // favorite
                map = MapUtil.getNewMap(travelMapper.selectFavoriteById(id, userId));
                break;
                default:
            case 3: // reply
                map = new HashMap();
                break;
        }

        map.put("count",count);
        return map;
    }

    public List<Travel> selectByStatus(Long strategyId, Integer state) {
        return travelMapper.selectByStatus(strategyId,state);
    }

    public PageInfo queryTravelByauthorId(UserQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize(),qo.getOrderBy());
        List list = travelMapper.selectForListByUserId(qo);
        return new PageInfo(list);
    }

    @Override
    public int selectCoent(Long userId) {

        return travelMapper.selectCoent(userId);

    }

}
