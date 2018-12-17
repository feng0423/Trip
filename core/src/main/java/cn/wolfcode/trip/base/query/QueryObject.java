package cn.wolfcode.trip.base.query;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QueryObject {
    private int currentPage = 1;
    private int pageSize = 3;
    //排序
    private String orderBy;

    public int getStart(){
        return (currentPage - 1) * pageSize;
    }


}
