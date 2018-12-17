package cn.wolfcode.trip.base.query;

import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class StrategyQueryObject extends QueryObject{


    //状态查询
    private Integer state;

    //根据地区的id查询条件
    private Integer regionId;

    //关键字
    private String keyword;

    public String getKeyword(){
        return StringUtils.hasLength(keyword) ? keyword.trim() : null;
    }
}
