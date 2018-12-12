package cn.wolfcode.trip.app.filter;

import cn.wolfcode.trip.base.util.UploadUtil;
import org.apache.commons.io.FileUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

public class ImageFilter implements Filter {

    //第一步:配置图片过滤器
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        //第二步: 强转,获取当前请求图片的路径
        HttpServletRequest req = (HttpServletRequest) request;
        String uri = req.getRequestURI();
        //判断图片目录是否存在该图片
        File file = new File(UploadUtil.PATH, uri);
        //判断文件是否存在
        if(file.exists()){
            //如果存在就响应给浏览器
            response.getOutputStream().write(FileUtils.readFileToByteArray(file));
        }else{
            chain.doFilter(request,response);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void destroy() {

    }
}
