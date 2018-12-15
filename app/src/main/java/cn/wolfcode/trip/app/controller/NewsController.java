package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.query.NewsQueryObject;
import cn.wolfcode.trip.base.query.TravelCommendQueryObject;
import cn.wolfcode.trip.base.service.INewsService;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/news")
public class NewsController {

    @Autowired
    private INewsService newsService;

    @GetMapping
    public PageInfo query(NewsQueryObject qo) {
        PageInfo query = newsService.query(qo);
        return query;
    }

    @GetMapping("/{id}")
    public News getById(@PathVariable Long id){
        newsService.update(id);
        return newsService.getById(id);
    }

    @GetMapping("/contents")
    public PageInfo listContents(NewsQueryObject qo){
        qo.setOrderBy("n.creationTime desc");
        return  newsService.queryForList(qo);
    }

   @GetMapping("/content")
    public PageInfo listContent(NewsQueryObject qo){
        return  newsService.queryForList(qo);
    }

}
