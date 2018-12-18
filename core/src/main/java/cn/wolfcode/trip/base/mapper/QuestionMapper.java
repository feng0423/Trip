package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Question;
import cn.wolfcode.trip.base.query.QueryObject;
import java.util.List;

public interface QuestionMapper {
    /**
     * 删除一条评论时, 同时删除其下面所有回复
     * @param id
     * @return
     */
    int deleteByPrimaryKey(Long id);


    /**
     * 新增一条评论
     * @param record
     * @return
     */
    int insert(Question record);

    /**
     * 列出一篇游记, 或攻略, 或日报的所有评论
     * @return
     */
    List<Question> selectAll();
}