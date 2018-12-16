package cn.wolfcode.trip.base.query;

import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

import javax.management.Query;
@Getter
@Setter

public class TicketsQueryObject extends QueryObject {
   //状态查询
    private Integer state;
    //排序
    private Integer type;

    private String keyword; //关键字

    public String getKeyword(){
        return StringUtils.hasLength(keyword) ? keyword.trim() : null;
    }
}
