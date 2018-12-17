package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.StrategyComment;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.UserQueryObject;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StrategyCommentMapper {
    int deleteByPrimaryKey(Long id);

    int insert(StrategyComment record);

    StrategyComment selectByPrimaryKey(Long id);

    List<StrategyComment> selectAll();

    int updateByPrimaryKey(StrategyComment record);

    List selectForList(QueryObject qo);

    void insertRelation(@Param("commentId") Long commentId, @Param("tagId") Long tagId);

    List selectFqueryStrategycommentsByUserIdorList(UserQueryObject qo);

    void changeState(@Param("id") Long id, @Param("state") Integer state);

    List<StrategyComment> selectByStatus(@Param("state") Integer state);
}