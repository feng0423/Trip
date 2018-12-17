package cn.wolfcode.trip.base.domain;

import com.alibaba.druid.support.json.JSONUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;

@Getter
@Setter

public class Order extends  BaseDomain{

    private User user;//关联user表名称
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date create_time;//创建时间

    private String username;//联系人

    private String phone;//联系电话

    private BigDecimal total_prices;//总价格

    private Tickets tickets;//关联tickets 表

    /*门票数据回显方法*/
    public String getJson(){
        HashMap<String, Object> map = new HashMap();
        map.put("id",id);
        map.put("create_time",create_time);
        map.put("username",username);
        map.put("phone",phone);
        map.put("total_prices",total_prices);

        //用户数据
        map.put("userId",user.getId());//用户id
        map.put("Useremail",user.getEmail());//邮箱
        map.put("UsernickName",user.getNickName());//用户名称

        //门票数据
        map.put("ticketsId",tickets.getId());//门票id
        map.put("ticketsPrice",tickets.getPrice());//门票单价
        map.put("ticketsName",tickets.getName());//门票名称
        return JSONUtils.toJSONString(map);
    }
}