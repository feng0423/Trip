package cn.wolfcode.trip.base.domain;

import cn.wolfcode.trip.base.util.DateUtil;
import com.alibaba.druid.support.json.JSONUtils;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Getter
@Setter
//转json的时候不要序列化
@JsonIgnoreProperties("handler")
public class Reply extends  BaseDomain{


    public static final int REPLY_TRAVEL = 1; // 评论游记
    public static final int REPLY_STRATEGY = 2; // 评论攻略
    public static final int REPLY_NEWS = 3; // 评论日报

    // 评论的标题
    private String title;

    // 评论的内容
    private String content;

    // 结合type字段, 决定评论的是日报还是游记还是攻略
    private Long targetId;


    // 用户
    private User user;

    // 类型
    private Integer type = REPLY_TRAVEL;

    // 创建时间
    private Date createTime;

    // 图片
    private String imgUrl;

    private List<ReplySecond> replies;

    public String getTimeString() throws ParseException {

        return DateUtil.getDateString(createTime);

    }

    public String getJson(){
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id",id);
        map.put("title",title);
        map.put("content",content);
        map.put("targetId",targetId);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        map.put("createTime",sdf.format(createTime));
        map.put("type",type);
        map.put("imgUrl",imgUrl);
        if(user!=null){
            map.put("user.id",user.getId());
            map.put("user.nickName",user.getNickName());
            map.put("user.headImgUrl",user.getHeadImgUrl());
        }
        return JSONUtils.toJSONString(map);
    }
}