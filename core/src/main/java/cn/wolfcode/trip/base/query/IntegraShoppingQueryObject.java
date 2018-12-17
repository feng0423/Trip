package cn.wolfcode.trip.base.query;

import org.springframework.util.StringUtils;

public class IntegraShoppingQueryObject extends QueryObject{

    private String keyword; //关键字

    public String getKeyword(){
        return StringUtils.hasLength(keyword) ? keyword.trim() : null;
    }

}
