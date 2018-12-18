package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.Question;
import cn.wolfcode.trip.base.domain.Question;
import cn.wolfcode.trip.base.domain.QuestionSecond;
import cn.wolfcode.trip.base.mapper.QuestionMapper;
import cn.wolfcode.trip.base.mapper.QuestionSecondMapper;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.QuestionQueryObject;
import cn.wolfcode.trip.base.service.IQuestionService;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements IQuestionService {

    @Autowired
    private QuestionMapper questionMapper;

    private QuestionSecondMapper questionSecondMapper;

    public void save(Question question) {
        question.setUser(UserContext.getUser());
        questionMapper.insert(question);
    }

    public void delete(Long id) {
        questionSecondMapper.deleteByQuestionId(id);
        questionMapper.deleteByPrimaryKey(id);
    }

    public PageInfo<Question> queryForAppList(QuestionQueryObject qo) {

        PageHelper.startPage(qo.getCurrentPage(), qo.getPageSize(), qo.getOrderBy());
        List<Question> list = questionMapper.selectAll();

        for(Question question :list){
            for(QuestionSecond q :question.getReplies()){

                System.out.println(q);
            }
        }
        return new PageInfo<Question>(list);

    }
}
