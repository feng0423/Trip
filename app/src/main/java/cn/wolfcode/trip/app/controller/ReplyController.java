package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.Reply;
import cn.wolfcode.trip.base.query.ReplyQueryObject;
import cn.wolfcode.trip.base.service.IReplyService;
import cn.wolfcode.trip.base.util.JsonResult;
import cn.wolfcode.trip.base.util.UploadUtil;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/replies")
public class ReplyController {

    @Autowired
    private IReplyService replyService;

//    @GetMapping("/title")
//    public PageInfo list(ReplyQueryObject qo) {
//        return replyService.queryForAppList(qo);
//    }

    @GetMapping
    public PageInfo list(ReplyQueryObject qo) {
        return replyService.queryForAppList(qo);
    }

    @PostMapping("/save")
    public JsonResult save(Reply reply, MultipartFile file){
        if(file!=null && file.getSize()>0){
            String uri = UploadUtil.upload(file, UploadUtil.Qi_PATH + "/upload");
            reply.setImgUrl(uri);
        }
        replyService.save(reply);
        return new JsonResult();
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
