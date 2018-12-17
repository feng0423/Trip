package cn.wolfcode.trip.base.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendComment extends BaseDomain{
    //评论者
    private User replyUser;
    //被评论者
    private User targetUser;
    //评论内容
    private String content;
    //朋友圈
    private CircleOfFriends circle;


}