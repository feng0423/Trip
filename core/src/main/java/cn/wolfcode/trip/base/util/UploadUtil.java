package cn.wolfcode.trip.base.util;

import com.google.gson.Gson;
import com.qiniu.common.QiniuException;
import com.qiniu.common.Zone;
import com.qiniu.http.Response;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.UploadManager;
import com.qiniu.storage.model.DefaultPutRet;
import com.qiniu.util.Auth;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * 文件上传工具
 */
public class UploadUtil {

    //存放图片的路径
    public static final String PATH = "d://trip";
    public static final String Qi_PATH = "http://pjm6lgm9s.bkt.clouddn.com/";

    /**
     * 处理文件上传
     *
     * @param file
     * @param basePath
     * @return 123.png
     */
    public static String upload(MultipartFile file, String basePath) {  // c://trip/upload

        //获取随机字符串
        String uuid = UUID.randomUUID().toString();
        //获取上传的文件的名称
        String orgFileName = file.getOriginalFilename();
        //获取文件后缀名
        String ext = "." + FilenameUtils.getExtension(orgFileName);
        //文件名称
        String fileName = uuid + ext;
        try {
            //c://trip/upload/sss.jpg   sss为uuid
            File targetFile = new File(basePath, fileName);
            FileUtils.writeByteArrayToFile(targetFile, file.getBytes());
            return "/upload/" + fileName;

        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    public static String uploadQiniyun(MultipartFile file) {
        // c://trip/upload
        //构造一个带指定Zone对象的配置类
        Configuration cfg = new Configuration(Zone.zone2());
        //...其他参数参考类注释
        UploadManager uploadManager = new UploadManager(cfg);
        //...生成上传凭证，然后准备上传
        String accessKey = "NEONF9dkSlW7NfL38WYGycgpzPHTKsYj4gZScDK7";
        String secretKey = "hySceI4NGlnP7YTTr9VChpVUdvnk1DIIcUwZFDa8";
        String bucket = "trip";
        //如果是Windows情况下，格式是 D:\\qiniu\\test.png
        String localFilePath = "D:\\trip\\upload\\1.jpeg";
        //默认不指定key的情况下，以文件内容的hash值作为文件名
        String key = null;//文件名称
        Auth auth = Auth.create(accessKey, secretKey);
        String upToken = auth.uploadToken(bucket);
        try {
            Response response = null;
            try {
                response = uploadManager.put(file.getBytes(), key, upToken);
            } catch (IOException e) {
                e.printStackTrace();
            }
            //解析上传成功的结果
            DefaultPutRet putRet = new Gson().fromJson(response.bodyString(), DefaultPutRet.class);//上传图片
            System.out.println(putRet.key);
            System.out.println(putRet.hash);
            return putRet.key;
        } catch (QiniuException ex) {
            Response r = ex.response;
            System.err.println(r.toString());
            try {
                System.err.println(r.bodyString());
            } catch (QiniuException ex2) {
                //ignore
            }
        }
        return null;
    }
}
























