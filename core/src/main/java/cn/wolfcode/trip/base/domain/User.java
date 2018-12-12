package cn.wolfcode.trip.base.domain;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@ApiModel(value="用户",description="平台注册用户模型")
////用户的实体类
public class User extends BaseDomain{

    public static final int man = 1; //男
    public static final int women = 0; //女
    public static final int secret = -1; //保密

    private String email; //邮箱

    private String nickName; //昵称

    private String password; //密码

    private String place; //地区

    private String headImgUrl; //头像

    private Integer gender = secret; //性别

    private String coverImgUrl; //封面

    private String sign; //签名

    public String getGenderName(){
        String temp = "保密";
        if(gender == 1){
            temp = "男";
        }else if(gender == 0){
            temp = "男";
        }
        return temp;
    }

}