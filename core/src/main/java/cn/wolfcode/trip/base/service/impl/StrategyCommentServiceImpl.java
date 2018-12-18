package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.StrategyComment;
import cn.wolfcode.trip.base.domain.Tag;
import cn.wolfcode.trip.base.mapper.StrategyCommentMapper;
import cn.wolfcode.trip.base.mapper.TagMapper;
import cn.wolfcode.trip.base.query.StrategyCommentQueryObject;
import cn.wolfcode.trip.base.query.UserQueryObject;
import cn.wolfcode.trip.base.service.IStrategyCommentService;
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
public class StrategyCommentServiceImpl implements IStrategyCommentService {

    @Autowired
    private StrategyCommentMapper strategyCommentMapper;

    @Autowired
    private TagMapper tagMapper;



    public PageInfo query(StrategyCommentQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize(),qo.getOrderBy());
        List list  = strategyCommentMapper.selectForList(qo);
        return new PageInfo(list);
    }

    public void save(StrategyComment strategyComment,String[] tags) {
        //设置评论者
        strategyComment.setUser(UserContext.getUser());
        //设置创建时间
        strategyComment.setCreateTime(new Date());
        strategyCommentMapper.insert(strategyComment);
        //保存标签
        for (String tagString : tags){
            Tag tag = new Tag();
            tag.setName(tagString);
            tagMapper.insert(tag);
            //关联中间表
            strategyCommentMapper.insertRelation(strategyComment.getId(),tag.getId());
        }
    }

    public void changeState(Long id, Integer state) {
        strategyCommentMapper.changeState(id,state);
    }

    public List<StrategyComment> selectByStatus(Integer state) {
        return strategyCommentMapper.selectByStatus(state);
    }

    public PageInfo queryStrategycommentsByUserId(UserQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize(),qo.getOrderBy());
        List list  = strategyCommentMapper.selectFqueryStrategycommentsByUserIdorList(qo);
        return new PageInfo(list);
    }

    public Map like(Long id) {
        if (!UserContext.isLogined())
            return null;
        Long userId = UserContext.getUser().getId();
        Map map = new HashMap();
        if (userId !=null){

            Map mapSelect = strategyCommentMapper.selectLikeById(id, userId);
            if (mapSelect==null) {
                strategyCommentMapper.insertLikeStrategyCommentUserRelation(id, userId);
                map.put("hasClick",true);
            }else {
                strategyCommentMapper.deleteLikeStrategyCommentUserRelation(id, userId);
                map.put("hasClick",false);
            }
        }



        map.put("count",strategyCommentMapper.countLikes(id));

        return map;
    }


    public Map getLikeById(Long id) {
        return getCommonMap(id, strategyCommentMapper.countLikes(id));
    }

    public Map getCommonMap(Long id, int count) {
        Map map;
        if (!UserContext.isLogined()) {
            map = MapUtil.getNewMap(null);
            map.put("count",count);
            return map;
        }

        Long userId = UserContext.getUser().getId();
        map = MapUtil.getNewMap(strategyCommentMapper.selectLikeById(id, userId));

        map.put("count",count);
        return map;
    }
    @Override
    public List<StrategyComment> selectCommentStrategy() {
        return strategyCommentMapper.selectCommentStrategy();
    }

}
