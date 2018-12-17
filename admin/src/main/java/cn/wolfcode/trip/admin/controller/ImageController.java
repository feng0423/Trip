package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.util.UploadUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * @Description:
 * @Author: Tank
 * @Date: 2018/12/9 15:59
 * @Version: 1.0
 */
@RestController
@RequestMapping("/images")
public class ImageController {

    @PostMapping
    public Map register(MultipartFile upload){
        //上传图片,保存到指定目录
        HashMap<String, Object> map = new HashMap();
        try {
            //别忘加upload
           // String url = UploadUtil.upload(upload,UploadUtil.PATH+"/upload");

            String url = UploadUtil.uploadQiniyun(upload);
            map.put("url",UploadUtil.Qi_PATH+url);

            map.put("uploaded",1);
            map.put("url",url);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("uploaded",0);
            HashMap<String, Object> map1 = new HashMap();
            map1.put("message","亲,上传失败");
            map.put("error",map1);
        }
        return map;
    }
}
