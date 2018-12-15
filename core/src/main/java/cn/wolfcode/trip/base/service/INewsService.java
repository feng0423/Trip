package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.domain.NewsContent;
import cn.wolfcode.trip.base.query.NewsQueryObject;
import com.github.pagehelper.PageInfo;
import java.util.List;

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

}
