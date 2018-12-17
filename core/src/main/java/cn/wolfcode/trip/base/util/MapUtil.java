package cn.wolfcode.trip.base.util;

import java.util.HashMap;
import java.util.Map;

public abstract class MapUtil {
    public static Map getNewMap(Map map) {
        if (map==null){
            map = new HashMap();
            map.put("hasClick",false);
        }else {
            map.put("hasClick",true);
        }
        return map;
    }
}
