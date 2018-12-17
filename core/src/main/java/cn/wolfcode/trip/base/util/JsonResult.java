package cn.wolfcode.trip.base.util;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

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

    // 通过把map传入Obj,返还一个success为true的JsonResult
    public static JsonResult jsonResultWithMap(Map map){
        JsonResult jsonResult = new JsonResult();

        // 如果页面取此值为null, 即当前没有收藏;反之有收藏
        jsonResult.setObj(map);
        return jsonResult;
    }
}
