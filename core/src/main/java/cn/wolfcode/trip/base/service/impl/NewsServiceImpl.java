package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.domain.NewsContent;
import cn.wolfcode.trip.base.mapper.NewsContentMapper;
import cn.wolfcode.trip.base.mapper.NewsMapper;
import cn.wolfcode.trip.base.query.NewsQueryObject;
import cn.wolfcode.trip.base.query.TravelCommendQueryObject;
import cn.wolfcode.trip.base.service.INewsService;
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
public class NewsServiceImpl implements INewsService{

    @Autowired
    private NewsMapper newsMapper;

    @Autowired
    private NewsContentMapper contentMapper;

    public PageInfo query(NewsQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List list  = newsMapper.selectForList(qo);
        return new PageInfo(list);
    }

    public void saveOrUpdate(News news) {

        NewsContent content = new NewsContent();
        if(news.getId()!=null){
            newsMapper.updateByPrimaryKey(news);
        }else{
            newsMapper.insert(news);
            content.setId(news.getId());
            content.setContent(news.getContent().getContent());
            contentMapper.insert(content);
        }
    }

    public List<News> listAll() {

        return newsMapper.selectAll();
    }

    public News getById(Long id) {
        return newsMapper.selectByPrimaryKey(id);
    }

    public PageInfo queryForList(NewsQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize(),qo.getOrderBy());
        List list  = newsMapper.selectForAppList(qo);
        return new PageInfo(list);
    }

    public void update(Long id) {
        newsMapper.update(id);
    }


    public Map like(Long id) {

        if (!UserContext.isLogined())
            return null;

        Long userId = UserContext.getUser().getId();
        Map map = new HashMap();
        if (userId !=null){

            Map mapSelect = newsMapper.selectLikeById(id, userId);
            if (mapSelect==null) {
                newsMapper.insertLikeTravelUserRelation(id, userId);
                map.put("hasClick",true);
            }else {
                newsMapper.deleteLikeTravelUserRelation(id, userId);
                map.put("hasClick",false);
            }
        }



        map.put("count",newsMapper.countLikes(id));

        return map;
    }

    public Map getLikeById(Long id) {
        Map map;
        if (!UserContext.isLogined()) {
            map = MapUtil.getNewMap(null);
            map.put("count",newsMapper.countLikes(id));
            return map;
        }
        Long userId = UserContext.getUser().getId();
        map = MapUtil.getNewMap(newsMapper.selectLikeById(id, userId));
        map.put("count",newsMapper.countLikes(id));
        return map;
    }

    public Map favorite(Long id) {
        if (!UserContext.isLogined())
            return null;
        Long userId = UserContext.getUser().getId();

        Map map = new HashMap();
        if (userId !=null){
            Map mapSelect = newsMapper.selectFavoriteById(id, userId);
            if (mapSelect==null) {
                newsMapper.insertFavoriteTravelUserRelation(id, userId);
                map.put("hasClick",true);
            }else {
                newsMapper.deleteFavoriteTravelUserRelation(id, userId);
                map.put("hasClick",false);
            }
        }

        map.put("count",newsMapper.countFavorites(id));

        return map;
    }

    public Map getFavoriteById(Long id) {
        Map map;
        if (!UserContext.isLogined()) {
            map = MapUtil.getNewMap(null);
            map.put("count",newsMapper.countFavorites(id));
            return map;
        }

        Long userId = UserContext.getUser().getId();

        map = MapUtil.getNewMap(newsMapper.selectFavoriteById(id, userId));
        map.put("count",newsMapper.countFavorites(id));
        return map;
    }

}
