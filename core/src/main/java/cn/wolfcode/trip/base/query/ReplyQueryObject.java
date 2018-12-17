package cn.wolfcode.trip.base.query;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyQueryObject extends QueryObject{
    private Long targetId;
    private Integer type;
    private Long parentId;
}
