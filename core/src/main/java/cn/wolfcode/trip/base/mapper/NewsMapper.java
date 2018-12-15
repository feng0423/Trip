package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.query.NewsQueryObject;

import java.util.List;

public interface NewsMapper {

    int deleteByPrimaryKey(Long id);

    int insert(News record);

    News selectByPrimaryKey(Long id);

    List<News> selectAll();

    int updateByPrimaryKey(News record);


    //查询结果集
    List<News> selectForList(NewsQueryObject qo);

    //查询所有结果集,按创建时间排序
    List selectForAppList(NewsQueryObject qo);

    /**
     *
     * @param id
     */
    void update(Long id);
}