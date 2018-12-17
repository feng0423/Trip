package cn.wolfcode.trip.base.domain;

import com.alibaba.druid.support.json.JSONUtils;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashMap;

/**
 * 门票实体类
 */
@Getter
@Setter

public class Tickets extends  BaseDomain{

    //普通
    public static final int STATE_NORMAL = 0;
    //热门
    public static final int STATE_HOT = 1;
    //禁用
    public static final int STATE_DISABLE = -1;

    //票价类型
    //每周推荐
    public static final int TYPE_WEEK = 1;
    //每月推荐
    public static final int TYPE_MONTH = 2;
    //攻略推荐
    public static final int TYPE_STRATEGY = 3;

    private String name;//地点名称

    private BigDecimal price;//价格

    private String coverurl;//图片

    private Integer state= STATE_NORMAL;//状态

    //推荐类型
    private Integer type= TYPE_WEEK;

    public String getTypeName(){
        String temp = "";
        if (type == TYPE_WEEK){
            temp = "价格从高到底";
        }else if(type == TYPE_MONTH){
            temp = "价格从底到高";
        }else {
            temp = "综合排序";
        }
        return temp;
    }

    public String getStateName(){
        String temp = "";
        switch (state){
            case STATE_NORMAL:
                temp = "普通";
                break;
            case STATE_HOT:
                temp = "推荐";
                break;
            default:
                temp = "禁用";
        }
        return temp;
    }
    /*门票数据回显方法*/
    public String getJson(){
        HashMap<String, Object> map = new HashMap();
        map.put("id",id);
        map.put("name",name);
        map.put("price",price);
        map.put("coverurl",coverurl);
        map.put("state",state);
        map.put("type",type);
        return JSONUtils.toJSONString(map);
    }

}