package cn.wolfcode.trip.base.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class SystemMessage {
    private Long id;

    private String message;

    private User user;
    @JsonFormat(pattern = "yyyy年-MM月-dd日 HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    private Integer reading;

    private Travel travel;

    /*public String getJson(){
        HashMap<String, Object> map = new HashMap();
        map.put("id",id);
        map.put("userHeadImgUrl",user.getHeadImgUrl());
        map.put("userNickName",user.getNickName());
        map.put("travelId",travel.id);
        return JSONUtils.toJSONString(map);
    }*/
}