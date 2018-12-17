package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.query.NewsQueryObject;
import cn.wolfcode.trip.base.service.INewsService;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


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
    public News getById(@PathVariable Long id) {
        newsService.update(id);
        return newsService.getById(id);
    }

    @GetMapping("/contents")
    public PageInfo listContents(NewsQueryObject qo) {
        qo.setOrderBy("n.creationTime desc");
        return newsService.queryForList(qo);
    }

    @GetMapping("/content")
    public PageInfo listContent(NewsQueryObject qo) {
        return newsService.queryForList(qo);
    }


    @GetMapping("/{id}/likes/{state}")
    public JsonResult like(@PathVariable Long id, @PathVariable int state) {

        Map map;
        if (state == -1) {// 查询
            map = newsService.getLikeById(id);
        } else {// 插入或删除
            map = newsService.like(id);
        }

        return JsonResult.jsonResultWithMap(map);
    }


    @GetMapping("/{id}/favorites/{state}")
    public JsonResult favorite(@PathVariable Long id, @PathVariable int state) {

        Map map;
        if (state == -1) {// 查询
            map = newsService.getFavoriteById(id);
            // 如果页面取此值为null, 即当前没有收藏;反之有收藏
        } else {// 插入或删除
            map = newsService.favorite(id);
        }
        return JsonResult.jsonResultWithMap(map);
    }


    @GetMapping("/{id}/replies")
    public JsonResult reply(@PathVariable Long id) {
        return JsonResult.jsonResultWithMap(newsService.getReplyById(id));
    }


}
