package cn.wolfcode.trip.base.domain;

import com.alibaba.druid.support.json.JSONUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class TravelCommend extends BaseDomain{
    //每周推荐
    public static final int TYPE_WEEK = 1;
    //每月推荐
    public static final int TYPE_MONTH = 2;
    //攻略推荐
    public static final int TYPE_STRATEGY = 3;
    //关联游记
    private Travel travel;
    //标题
    private String title;
    //副标题
    private String subTitle;
    //封面url
    private String coverUrl;
    //推荐时间安排
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date schedule;
    //推荐类型
    private Integer type;
    public String getTypeName(){
        String temp = "";
        if (type == TYPE_WEEK){
            temp = "每周推荐";
        }else if(type == TYPE_MONTH){
            temp = "每月推荐";
        }else {
            temp = "攻略推荐";
        }
        return temp;
    }


    public String getJson(){
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id",id);
        map.put("title",title);
        map.put("subTitle",subTitle);
        map.put("travelId",travel.getId());
        map.put("coverUrl",coverUrl);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        map.put("schedule",sdf.format(schedule));
        map.put("type",type);


        return JSONUtils.toJSONString(map);
    }

}