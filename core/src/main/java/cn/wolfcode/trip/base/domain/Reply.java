package cn.wolfcode.trip.base.domain;

import com.alibaba.druid.support.json.JSONUtils;
import lombok.Getter;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class Reply extends  BaseDomain{


    public static final int REPLY_TRAVEL = 1; // 评论游记
    public static final int REPLY_STRATEGY = 2; // 评论攻略
    public static final int REPLY_NEWS = 3; // 评论日报

    // 评论的标题
    private String title;

    // 评论的内容
    private String content;

    // 结合type字段, 决定评论的是日报还是游记还是攻略
    private Long target_id;

    // 供二级评论使用
    private Long parent_id;

    // 用户
    private User user;

    // 类型
    private Integer type = REPLY_TRAVEL;

    // 创建时间
    private Date create_time;

    // 图片
    private String imgUrl;


    public String getJson(){
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id",id);
        map.put("title",title);
        map.put("content",content);
        map.put("travelId",target_id);
        map.put("parentId",parent_id);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        map.put("create_time",sdf.format(create_time));
        map.put("type",type);
        map.put("imgUrl",imgUrl);
        if(user!=null){
            map.put("id",user.getId());
            map.put("nickName",user.getNickName());
            map.put("headImgUrl",user.getHeadImgUrl());
        }
        return JSONUtils.toJSONString(map);
    }
}