package cn.wolfcode.trip.base.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Getter
@Setter

@JsonIgnoreProperties(value = {"handler"})
public class CircleOfFriends extends BaseDomain {
    //用户
    private User user;
    //发布时间
    private String releaseTime;
    //内容
    private String content;
    //图片
    private String pictureUrl;
    //评论
    private List<FriendComment> comments;

}