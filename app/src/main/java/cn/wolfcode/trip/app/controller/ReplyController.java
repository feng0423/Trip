package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.Reply;
import cn.wolfcode.trip.base.domain.ReplySecond;
import cn.wolfcode.trip.base.query.ReplyQueryObject;
import cn.wolfcode.trip.base.service.IReplySecondService;
import cn.wolfcode.trip.base.service.IReplyService;
import cn.wolfcode.trip.base.util.JsonResult;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/replies")
public class ReplyController {

    @Autowired
    private IReplyService replyService;

    @Autowired
    private IReplySecondService replySecondService;

//    @GetMapping("/title")
//    public PageInfo list(ReplyQueryObject qo) {
//        return replyService.queryForAppList(qo);
//    }

    @GetMapping
    public PageInfo<Reply> list(ReplyQueryObject qo) {
        qo.setOrderBy("r.create_time DESC");
        return replyService.queryForAppList(qo);
    }

    @PostMapping("/save")
    public JsonResult save(Reply reply){
        JsonResult jsonResult = new JsonResult();
        if (!UserContext.isLogined()){
            jsonResult.mark("请登录后再试!");
            return jsonResult;
        }

        replyService.save(reply);
        return jsonResult;
    }

    @PostMapping("/saveLevel2")
    public JsonResult saveLevel2(ReplySecond replySecond){
        JsonResult jsonResult = new JsonResult();
        if (!UserContext.isLogined()){
            jsonResult.mark("请登录后再试!");
            return jsonResult;
        }

        replySecondService.save(replySecond);
        return jsonResult;
    }

    @DeleteMapping("/delete")
    public JsonResult delete(ReplyQueryObject qo){
        replyService.deleteByTargetIdType(qo);
        return new JsonResult();
    }

    @DeleteMapping("/delete/{id}")
    public JsonResult delete(@PathVariable Long id,ReplyQueryObject qo){
        replyService.delete(id);
        return new JsonResult();
    }
}
