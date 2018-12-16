package cn.wolfcode.trip.base.query;

import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class UserQueryObject extends QueryObject {
    private String keyword; //关键字
    public Long UserId;//用户ID

    public String getKeyword(){
        return StringUtils.hasLength(keyword) ? keyword.trim() : null;
    }

}

