package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.Question;
import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.service.IQuestionService;
import cn.wolfcode.trip.base.util.JsonResult;
import cn.wolfcode.trip.base.util.UploadUtil;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;


@RestController
@RequestMapping("/questions")
public class QuestionController {


    @Autowired
    private IQuestionService questionService;


    @GetMapping
    public PageInfo query(QueryObject qo) {
        PageInfo query = questionService.query(qo);
        return query;
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable Long id) {

        return questionService.getById(id);
    }


    @PostMapping("/addAsk")
    public JsonResult save(Question question,MultipartFile file) {
       /* String url = UploadUtil.uploadQiniyun(file);
        //判断是否上传文件
        if(file!=null && file.getSize()>0) {


            question.setCoverUrl(UploadUtil.Qi_PATH + url);
        }*/
        //获取用户的id
        User user = UserContext.getUser();
        question.setCreateTime(new Date());
        //通过获取前端的value值隐藏域,判断是进入是评论还是回复
        if (question.getState() == 0) {
            //System.out.println("进入提问接口");
            question.setUser(user);
            question.setState(0);
            //查询所有数据,按降序排序
            List<Question> list = questionService.selectAll();
            if (list.size() == 0) {
                question.setId(1L);
            } else {
                Long id = list.get(0).getId();//如果不为0,就获取到最大一条的id
                question.setId(1L + 1);//手动自增1
            }
        } else {
            //回复功能
            // System.out.println("进入回复接口");
            String content = question.getContent();
            String id = question.getCoverUrl();
            question = questionService.getById(Long.parseLong(id));
            question.setState(1);
            question.setContent(content);
            question.setCoverUrl("");
        }

        //调用保存的方法
        questionService.save(question);
        return new JsonResult();

    }
}