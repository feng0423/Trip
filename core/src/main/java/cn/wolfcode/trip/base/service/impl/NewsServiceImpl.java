package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.domain.NewsContent;
import cn.wolfcode.trip.base.mapper.NewsContentMapper;
import cn.wolfcode.trip.base.mapper.NewsMapper;
import cn.wolfcode.trip.base.query.NewsQueryObject;
import cn.wolfcode.trip.base.query.TravelCommendQueryObject;
import cn.wolfcode.trip.base.service.INewsService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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

}
