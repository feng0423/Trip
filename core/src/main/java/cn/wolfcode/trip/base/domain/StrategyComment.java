package cn.wolfcode.trip.base.domain;

import com.alibaba.druid.support.json.JSONUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.HashMap;

/**
 * @Description: 攻略评论
 * @Author: Tank
 * @Date: 2018/12/10 12:17
 * @Version: 1.0
 */
@Setter
@Getter
public class StrategyComment extends BaseDomain {
    //正常
    public static final int STATE_NORMAL = 0;
    //推荐
    public static final int STATE_HOT = 1;
    //禁用
    public static final int STATE_DISABLE = -1;
    //点评者
    private User user;
    //创建时间
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    private Date createTime;
    //点评内容
    private String content;
    //图片urls
    private String imgUrls;
    //星星数量
    private Integer starNum;
    //所属攻略
    private Strategy strategy;
    //状态
    private Integer state = STATE_NORMAL;
    //推荐时间安排
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date commendTime;

    //将图片字符串进行切割,封装到属性数组中
    public String[] getImgArr() {
        if (StringUtils.hasLength(imgUrls)) {
            return imgUrls.split(";");
        }
        return null;
    }
    public String getStateName(){
        String temp = "";
        switch (state){
            case STATE_NORMAL:
                temp = "正常";
                break;
            case STATE_HOT:
                temp = "推荐";
                break;
            default:
                temp = "禁用";
        }
        return temp;
    }
    public String getJson(){
        HashMap<String, Object> map = new HashMap();
        map.put("id",id);
        map.put("state",state);
        if (user!=null){
            map.put("user.id",user.getId());
            map.put("user.nickName",user.getNickName());
            map.put("user.headImgUrl",user.getHeadImgUrl());
        }
        return JSONUtils.toJSONString(map);
    }

}