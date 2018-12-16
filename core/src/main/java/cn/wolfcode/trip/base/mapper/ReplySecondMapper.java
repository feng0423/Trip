package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.ReplySecond;
import java.util.List;

public interface ReplySecondMapper {
    int deleteByParentId(Long parentId);

    int insert(ReplySecond record);


    List<ReplySecond> selectAllByParentId(Long parentId);
}