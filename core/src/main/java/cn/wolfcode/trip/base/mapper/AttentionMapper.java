package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Attention;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AttentionMapper {
    int insert(Attention record);

    List<Attention> selectAll();

    void delete(@Param("visitorId") Long visitorId,@Param("authorId") Long authorId);

    Attention gatAttention(@Param("visitorId") Long visitorId,@Param("authorId") Long authorId);

    int selectAttention(Long userId);

    int selectFans(Long userId);
}