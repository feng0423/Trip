package cn.wolfcode.trip.base.service;


import cn.wolfcode.trip.base.domain.Question;
import cn.wolfcode.trip.base.query.QueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface IQuestionService {


    void save(Question question);

    List<Question> selectAll();

    PageInfo query(QueryObject qo);

    Question getById(Long id);

}
