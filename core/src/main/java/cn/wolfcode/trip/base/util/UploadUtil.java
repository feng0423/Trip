package cn.wolfcode.trip.base.util;

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
	/**
	 * 处理文件上传
	 * @param file
	 * @param basePath
	 * @return  123.png
	 */
	public static String upload(MultipartFile file, String basePath) {  // c://trip/upload

		//获取随机字符串
		String uuid = UUID.randomUUID().toString();
		//获取上传的文件的名称
		String orgFileName = file.getOriginalFilename();
		//获取文件后缀名
		String ext= "." + FilenameUtils.getExtension(orgFileName);
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

	
}
























