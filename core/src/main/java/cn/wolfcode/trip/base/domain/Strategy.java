package cn.wolfcode.trip.base.domain;

import com.alibaba.druid.support.json.JSONUtils;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

/**
 * 大攻略
 */
@Getter
@Setter
public class Strategy extends BaseDomain{
    //普通
    public static final int STATE_NORMAL = 0;
    //热门
    public static final int STATE_HOT = 1;
    //禁用
    public static final int STATE_DISABLE = -1;

    //地区
    private Region place;
    //标题
    private String title;
    //副标题
    private String subTitle;
    //封面
    private String coverUrl;
    //状态
    private Integer state = STATE_NORMAL;

    public String getStateName(){
        String temp = "";
        switch (state){
            case STATE_NORMAL:
                temp = "普通";
                break;
            case STATE_HOT:
                temp = "热门";
                break;
            default:
                temp = "禁用";
        }
        return temp;
    }
    public String getJson(){
        HashMap<String, Object> map = new HashMap();
        map.put("id",id);
        map.put("title",title);
        map.put("subTitle",subTitle);
        map.put("coverUrl",coverUrl);
        map.put("state",state);
        if(place!=null) {
            map.put("placeId", place.getId());
            map.put("placeName", place.getName());
        }
        return JSONUtils.toJSONString(map);
    }
}