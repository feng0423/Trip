package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.domain.NewsContent;
import cn.wolfcode.trip.base.query.NewsQueryObject;
import com.github.pagehelper.PageInfo;
import java.util.List;
import java.util.Map;

public interface INewsService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(NewsQueryObject qo);
    /**
     * 新增和编辑
     * @param news
     */
    void saveOrUpdate(News news);
    /**
     * 查询全部
     * @return
     */
    List<News> listAll();


    /**
     * 根据id查询内容
     * @param id
     * @return
     */
    News getById(Long id);

    /**
     * 分页查询所有
     * @param qo
     * @return
     */
    PageInfo queryForList(NewsQueryObject qo);

    void update(Long id);

    /**
     * 点赞或取消点赞
     * @param id
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
     */
    Map favorite(Long id);

    /**
     * 查询是否收藏了 返回null就没有收藏
     * @param id
     * @return
     */
    Map getFavoriteById(Long id);

    /**
     * 统计评论了多少条
     * @param id
     * @return
     */
    Map getReplyById(Long id);
}
