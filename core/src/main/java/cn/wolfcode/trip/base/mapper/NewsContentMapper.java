package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.NewsContent;
import java.util.List;

public interface NewsContentMapper {

    int deleteByPrimaryKey(Long id);

    int insert(NewsContent record);

    NewsContent selectByPrimaryKey(Long id);

    List<NewsContent> selectAll();

    int updateByPrimaryKey(NewsContent record);
}