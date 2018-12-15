package cn.wolfcode.trip.base.domain;

import com.alibaba.druid.support.json.JSONUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

@Getter
@Setter
public class News extends BaseDomain{

    private NewsContent content;//日报内容

    private String title;//标题

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    private Date creationTime;//创建时间

    private String coverUrl;//封面

    private Integer amount;//浏览数量


    public String getJson(){
        HashMap<String, Object> map = new HashMap();
        map.put("id",id);
        map.put("title",title);
        map.put("coverUrl",coverUrl);
        map.put("amount",amount);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        map.put("creationTime",sdf.format(creationTime));
        if(content!=null) {
            map.put("contentId", content.getId());
            map.put("contentContent",content.getContent());
        }
        return JSONUtils.toJSONString(map);
    }

}