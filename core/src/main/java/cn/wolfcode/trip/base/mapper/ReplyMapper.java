package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Reply;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ReplyMapper {
    /**
     * 删除一条评论时, 同时删除其下面所有回复
     * @param id
     * @return
     */
    int deleteByPrimaryKey(Long id);

    /**
     * 删除一篇游记或攻略或日报时, 删除多条
     * @param type
     * @param targetId
     * @return
     */
    int deleteByTargetId(@Param("type") Integer type, @Param("targetId") Long targetId);

    /**
     * 新增一条评论
     * @param record
     * @return
     */
    int insert(Reply record);

    /**
     * 列出一篇游记, 或攻略, 或日报的所有评论
     * @param type
     * @param targetId
     * @return
     */
    List<Reply> selectAllByTypeTargetId(@Param("type") Integer type,@Param("targetId") Long targetId);

}