package cn.wolfcode.trip.base.domain;

import cn.wolfcode.trip.base.util.DateUtil;
import com.alibaba.druid.support.json.JSONUtils;
import lombok.Getter;
import lombok.Setter;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class ReplySecond {
    private Long id;

    private String content;

    private User user;

    private Date createTime;

    private Long parentId;


    public String getTimeString() throws ParseException {

        return DateUtil.getDateString(createTime);

    }

    public String getJson(){
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id",id);
        map.put("content",content);
        map.put("parentId",parentId);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        map.put("create_time",sdf.format(createTime));
        if(user!=null){
            map.put("id",user.getId());
            map.put("nickName",user.getNickName());
            map.put("headImgUrl",user.getHeadImgUrl());
        }
        return JSONUtils.toJSONString(map);
    }
}