package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.domain.*;
import cn.wolfcode.trip.base.query.CircleOfFriendsQueryObject;
import cn.wolfcode.trip.base.query.StrategyQueryObject;
import cn.wolfcode.trip.base.service.*;
import cn.wolfcode.trip.base.util.JsonResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/circleOfFriendsService")
public class CircleOfFriendsController {

    @Autowired
    private ICircleOfFriendsService circleOfFriendsService;
    @Autowired
    private IFriendCommentService friendCommentService;


    @GetMapping("/{userId}")
    public PageInfo query(CircleOfFriendsQueryObject qo) {
        qo.setOrderBy("cof.releaseTime DESC");
        PageInfo query = circleOfFriendsService.query(qo);
        return query;
    }
    @PostMapping
    public JsonResult addDynamic(CircleOfFriends circleOfFriends) {

        circleOfFriendsService.save(circleOfFriends);

        return new JsonResult();
    }

    @PostMapping("/friendComment")
    public void addComment(FriendComment friendComment) {

        friendCommentService.save(friendComment);


    }


}
