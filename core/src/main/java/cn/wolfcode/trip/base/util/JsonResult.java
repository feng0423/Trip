package cn.wolfcode.trip.base.util;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JsonResult {

    private boolean success = true;
    private String msg;
    //如果成功将数据带上共享到前台
    private Object obj;
    //当错误的时候,使用方法来封装数据
    public void mark(String msg){
        this.success = false;
        this.msg = msg;
    }
}
