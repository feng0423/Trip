package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.Question;
import cn.wolfcode.trip.base.domain.QuestionSecond;
import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.QuestionQueryObject;
import cn.wolfcode.trip.base.service.IQuestionSecondService;
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

    @Autowired
    private IQuestionSecondService questionSecondService;

//    @GetMapping("/title")
//    public PageInfo list(QuestionQueryObject qo) {
//        return questionService.queryForAppList(qo);
//    }

    @GetMapping
    public PageInfo<Question> list(QuestionQueryObject qo) {
        qo.setOrderBy("id DESC");
        return questionService.queryForAppList(qo);
    }

    @PostMapping("/save")
    public JsonResult save(Question question) {
        JsonResult jsonResult = new JsonResult();
        if (!UserContext.isLogined()) {
            jsonResult.mark("请登录后再试!");
            return jsonResult;
        }

        questionService.save(question);
        return jsonResult;
    }

    @PostMapping("/saveLevel2")
    public JsonResult saveLevel2(QuestionSecond questionSecond) {
        JsonResult jsonResult = new JsonResult();
        if (!UserContext.isLogined()) {
            jsonResult.mark("请登录后再试!");
            return jsonResult;
        }

        questionSecondService.save(questionSecond);
        return jsonResult;
    }

    @DeleteMapping("/delete")
    public JsonResult delete(QuestionQueryObject qo) {
        questionService.delete(qo.getQuestionId());
        return new JsonResult();
    }

    @DeleteMapping("/delete/{id}")
    public JsonResult delete(@PathVariable Long id, QuestionQueryObject qo) {
        questionService.delete(id);
        return new JsonResult();
    }
}