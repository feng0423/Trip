package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.Strategy;
import cn.wolfcode.trip.base.domain.StrategyComment;
import cn.wolfcode.trip.base.mapper.StrategyCommentMapper;
import cn.wolfcode.trip.base.mapper.StrategyMapper;
import cn.wolfcode.trip.base.query.SerachQueryObject;
import cn.wolfcode.trip.base.query.StrategyQueryObject;
import cn.wolfcode.trip.base.service.IStrategyService;
import cn.wolfcode.trip.base.util.MapUtil;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StrategyServiceImpl implements IStrategyService{

    @Autowired
    private StrategyMapper strategyMapper;

    @Autowired
    private StrategyCommentMapper commentMapper;

    public PageInfo query(StrategyQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize(),true,false,null);
        List list  = strategyMapper.selectForList(qo);
        return new PageInfo(list);
    }

    public void saveOrUpdate(Strategy strategy) {
        if(strategy.getId()!=null){
            strategyMapper.updateByPrimaryKey(strategy);
        }else{
            strategyMapper.insert(strategy);
        }
    }

    public List<Strategy> listAll() {
        return strategyMapper.selectAll();
    }

    public Strategy getStrategyById(Long id) {
        return strategyMapper.selectByPrimaryKey(id);
    }

    public PageInfo queryList(SerachQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List<Strategy> list = strategyMapper.selectSearchForList(qo);
        return new PageInfo(list);
    }


    public List selectStrategyByUserId(Long userId) {
        return strategyMapper.selectStrategyByUserId(userId);
    }

    public List listLook() {
        return strategyMapper.selectAll();
    }


    //-------------

    public Map like(Long id) {
        if (!UserContext.isLogined())
            return null;
        Long userId = UserContext.getUser().getId();
        Map map = new HashMap();
        if (userId !=null){

            Map mapSelect = strategyMapper.selectLikeById(id, userId);
            if (mapSelect==null) {
                strategyMapper.insertLikeStrategyUserRelation(id, userId);
                map.put("hasClick",true);
            }else {
                strategyMapper.deleteLikeStrategyUserRelation(id, userId);
                map.put("hasClick",false);
            }
        }



        map.put("count",strategyMapper.countLikes(id));

        return map;
    }


    public Map favorite(Long id) {
        if (!UserContext.isLogined())
            return null;
        Long userId = UserContext.getUser().getId();

        Map map = new HashMap();
        if (userId !=null){
            Map mapSelect = strategyMapper.selectFavoriteById(id, userId);
            if (mapSelect==null) {
                strategyMapper.insertFavoriteStrategyUserRelation(id, userId);
                map.put("hasClick",true);
            }else {
                strategyMapper.deleteFavoriteStrategyUserRelation(id, userId);
                map.put("hasClick",false);
            }
        }

        map.put("count",strategyMapper.countFavorites(id));

        return map;
    }

    public Map getLikeById(Long id) {
        return getCommonMap(id, strategyMapper.countLikes(id),1);
    }

    public Map getFavoriteById(Long id) {
        return getCommonMap(id, strategyMapper.countFavorites(id),2);
    }

    public StrategyComment getCommentById(Long strategyCommentId) {
        return commentMapper.selectByPrimaryKey(strategyCommentId);
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
                map = MapUtil.getNewMap(strategyMapper.selectLikeById(id, userId));
                break;
            case 2: // favorite
                map = MapUtil.getNewMap(strategyMapper.selectFavoriteById(id, userId));
                break;
            default:
            case 3: // reply
                map = new HashMap();
                break;
        }

        map.put("count",count);
        return map;
    }

}
