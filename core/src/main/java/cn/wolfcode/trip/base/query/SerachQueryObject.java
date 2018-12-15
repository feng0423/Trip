package cn.wolfcode.trip.base.query;

import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class SerachQueryObject extends QueryObject{

    //查询的类型
    private Integer type ;
    //关键字
    private String keyword;

    public String getKeyword(){
        return StringUtils.hasLength(keyword) ? keyword.trim() : null;
    }

}
