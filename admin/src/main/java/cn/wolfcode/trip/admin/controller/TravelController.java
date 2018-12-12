package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.domain.Travel;
import cn.wolfcode.trip.base.domain.TravelContent;
import cn.wolfcode.trip.base.query.TravelQueryObject;
import cn.wolfcode.trip.base.service.ITravelCommendService;
import cn.wolfcode.trip.base.service.ITravelService;
import cn.wolfcode.trip.base.util.JsonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/travel")
public class TravelController {
    @Autowired
    private ITravelService travelService;
    @Autowired
    private ITravelCommendService travelCommendService;

    /**
     * 查看list
     * @param model
     * @param qo
     * @return
     */
    @RequestMapping("/list")
    public String list(Model model, @ModelAttribute("qo") TravelQueryObject qo) {
        if (qo.getState() == null) {
            //待审核状态
            qo.setState(Travel.STATE_AUDIT);
        }
        //公开
        qo.setIsPublic(true);
        //最后更新时间升序
        qo.setOrderBy("t.lastUpdateTime asc");
        model.addAttribute("pageInfo", travelService.query(qo));
        return "/travel/list";
    }

    /**
     * 查看文本
     * @param id
     * @return
     */
    @RequestMapping("/travelContentById")
    @ResponseBody
    public TravelContent travelContentById(Long id) {
        TravelContent travelContent = travelService.travelContentById(id);
        return travelContent;
    }

    /**
     * 修改状态:待审核发布等
     * @param id
     * @param state
     * @return
     */
    @PostMapping("/changeState")
    @ResponseBody
    public JsonResult changeState(Long id, Integer state) {
        travelService.changeState(id,state);
        return new JsonResult();
    }


    @RequestMapping("/releaseList")
    public String releaseList(Model model, @ModelAttribute("qo") TravelQueryObject qo) {
        //发布状态
        qo.setState(Travel.STATE_RELEASE);
        //发布时间降序
        qo.setOrderBy("t.releaseTime Desc");
        model.addAttribute("pageInfo", travelService.query(qo));
        return "/travel/releaseList";
    }

}
