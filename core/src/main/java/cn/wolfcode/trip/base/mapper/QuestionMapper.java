package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Question;
import cn.wolfcode.trip.base.query.QueryObject;
import java.util.List;

public interface QuestionMapper {
    int insert(Question record);

    List<Question> selectAll();

    List<Question> selectForList(QueryObject qo);

    Question selectByPrimaryKey(Long id);

}