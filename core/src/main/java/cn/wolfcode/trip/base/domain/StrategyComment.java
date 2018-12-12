package cn.wolfcode.trip.base.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.util.StringUtils;

import java.util.Date;

/**
 * @Description: 攻略页面评论列表
 * @Author: Tank
 * @Date: 2018/12/10 12:17
 * @Version: 1.0
 */
@Setter
@Getter
public class StrategyComment extends BaseDomain {
    //草稿
    public static final int STATE_NORMAL = 0;
    //推荐
    public static final int STATE_HOT = 1;
    //禁用
    public static final int STATE_DISABLE = -1;

    private User user;

    private Date createTime;

    private String content;

    private String imgUrls;

    private Integer starNum;

    private Strategy strategy;

    private Integer state;
    //推荐时间安排
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date commendTime;

    //将图片字符串进行切割,封装到属性数组中
    public String[] getImgArr() {
        if (StringUtils.hasLength(imgUrls)) {
            return imgUrls.split(";");
        }
        return null;
    }
}