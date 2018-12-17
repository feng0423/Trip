package cn.wolfcode.trip.base.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
public class Question extends BaseDomain {

   /* public static final int STATE_NORMAL = 0;//发布问题

    public static final int STATE_HOT = 1;//回复问题*/

    private String content;//内容

    private String title;//标题

    private String coverUrl;//图片

    private User user;//用户

    private Integer state;//状态

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    private Date createTime;//发布时间


   /* public String getStateName(){
        String temp = "";
        switch (state){
            case STATE_NORMAL:
                temp = "发布问题";
                break;

            default:
                temp = "回复问题";
        }
        return temp;
    }*/

}