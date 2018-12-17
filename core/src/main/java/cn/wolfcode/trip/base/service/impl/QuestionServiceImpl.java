package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.Question;
import cn.wolfcode.trip.base.mapper.QuestionMapper;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.service.IQuestionService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements IQuestionService {

    @Autowired
    private QuestionMapper questionMapper;

    //保存操作
    public void save(Question question) {
        questionMapper.insert(question);
    }

    //查询操作
    public List<Question> selectAll() {

        return questionMapper.selectAll();
    }

    public PageInfo query(QueryObject qo) {

        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List list  = questionMapper.selectForList(qo);
        return new PageInfo(list);
    }

    public Question getById(Long id) {

        return questionMapper.selectByPrimaryKey(id);
    }
}
