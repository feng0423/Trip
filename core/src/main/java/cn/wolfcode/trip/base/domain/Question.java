package cn.wolfcode.trip.base.domain;

import cn.wolfcode.trip.base.util.DateUtil;
import com.alibaba.druid.support.json.JSONUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
//转json的时候不要序列化
@JsonIgnoreProperties("handler")
public class Question extends BaseDomain {

    private String content;//内容

    private String title;//标题

    private String imgUrl;//图片

    private User user;//用户

    private List<QuestionSecond> replies;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    private Date createTime;//发布时间


    public String getTimeString() throws ParseException {

        return DateUtil.getDateString(createTime);

    }

    public String getJson(){
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id",id);
        map.put("title",title);
        map.put("content",content);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        map.put("createTime",sdf.format(createTime));
        map.put("imgUrl",imgUrl);
        if(user!=null){
            map.put("user.id",user.getId());
            map.put("user.nickName",user.getNickName());
            map.put("user.headImgUrl",user.getHeadImgUrl());
        }
        return JSONUtils.toJSONString(map);
    }

}