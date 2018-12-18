package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.QuestionSecond;
import cn.wolfcode.trip.base.mapper.QuestionSecondMapper;
import cn.wolfcode.trip.base.service.IQuestionSecondService;
import cn.wolfcode.trip.base.util.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuestionSecondServiceImpl implements IQuestionSecondService {

    @Autowired
    private QuestionSecondMapper questionSecondMapper;

    public void save(QuestionSecond questionSecond) {
        questionSecond.setUser(UserContext.getUser());
        questionSecondMapper.insert(questionSecond);
    }

}
