package cn.wolfcode.trip.base.domain;

import com.alibaba.druid.support.json.JSONUtils;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@ToString
public class Region extends BaseDomain {

    //其中状态可以为普通或者热门
    //普通
    public static final int STATE_NORMAL = 0;
    //热门
    public static final int STATE_HOT = 1;
    //名称
    private String name;
    //上级地区
    private Region parent;
    //状态
    private Integer state = STATE_NORMAL;
    /**
     * 将treeview需要的格式封装在实体类中
     * @return
     */
    public Map toTreeMap() {
        HashMap<String, Object> map = new HashMap();
        //需要通过id去查下一级的目录
        map.put("id", this.getId());
        map.put("text", this.getName());
        //该节点开启懒加载出现+
        map.put("lazyLoad",true);
        if (state == STATE_HOT) {
            map.put("tags", new String[]{"推荐"});
        }
        return map;
    }

    public String getJson() {
        HashMap<String, Object> map = new HashMap();
        //需要通过id去查下一级的目录
        map.put("id", this.getId());
        map.put("name", this.getName());
        map.put("state", state);
        if (parent != null) {
            map.put("parentId", parent.getId());
            map.put("parentName", parent.getName());
        }
        return JSONUtils.toJSONString(map);
    }
}