package cn.wolfcode.trip.base.query;

import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class TravelQueryObject extends QueryObject {

    private String keyword; //关键字*/

    private  Long authorId; //作者id

    private Integer state;//状态

    private Boolean isPublic;//是否公开

    private Long travelId; //查看已推荐的旅游文章

    public String getKeyword(){
        return StringUtils.hasLength(keyword) ? keyword.trim() : null;
    }


}

