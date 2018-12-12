package cn.wolfcode.trip.app.controller;

import cn.wolfcode.trip.base.util.UploadUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: Tank
 * @Date: 2018/12/9 15:30
 */
@RestController
@RequestMapping("/images")
public class ImageController {

    @PostMapping
    public Map register(MultipartFile file){
        //上传图片,保存到指定目录
        HashMap<String, Object> map = new HashMap<>();
        try {
            //别忘加upload
            String url = UploadUtil.upload(file,UploadUtil.PATH+"/upload");
            map.put("status",1);
            map.put("url",url);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("status",0);
            map.put("msg","亲,上传失败");
        }
        return map;
    }
}
