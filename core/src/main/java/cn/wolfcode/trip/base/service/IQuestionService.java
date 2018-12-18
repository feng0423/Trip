package cn.wolfcode.trip.base.service;


import cn.wolfcode.trip.base.domain.Question;
import cn.wolfcode.trip.base.domain.Reply;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.QuestionQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface IQuestionService {


    void save(Question question);

    void  delete(Long id);

    PageInfo<Question> queryForAppList(QuestionQueryObject qo);
}
