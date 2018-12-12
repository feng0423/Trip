package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.domain.Region;
import cn.wolfcode.trip.base.service.IRegionService;
import cn.wolfcode.trip.base.util.JsonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
/**
 * @Author: Tank
 * @Date: 2018/12/9 15:30
 */
@Controller
@RequestMapping("/region")
public class RegionController {
    @Autowired
    private IRegionService regionService;

    @RequestMapping("/list")
    public String list() {  //作用就是打开页面
        return "/region/list";
    }

    @RequestMapping("/changeState")
    @ResponseBody
    public JsonResult changeState(Region region) {
        regionService.changeState(region);
        return new JsonResult();
    }

    @RequestMapping("/listByParentId")
    @ResponseBody
    public List listByParentId(Long parentId, String type) {
        List<Region> list = regionService.queryByParentId(parentId);
        //判断是否tree类型
        if ("tree".equals(type)) {
            //创建treelist用来存放treeview格式的map
            ArrayList treeList = new ArrayList();
            //转换为treeview需要的格式
            for (Region region : list) {
                Map map = region.toTreeMap();
                treeList.add(map);
            }
            return treeList;
        } else {
            return list;
        }
    }

    @RequestMapping("/saveOrUpdate")
    @ResponseBody
    public Object saveOrUpdate(Region region) {
        regionService.saveOrUpdate(region);
        return new JsonResult();
    }
}
