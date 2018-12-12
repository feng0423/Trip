package cn.wolfcode.trip.admin.controller;

import cn.wolfcode.trip.base.query.UserQueryObject;
import cn.wolfcode.trip.base.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private IUserService userService;

    @RequestMapping("/list")
    public String list(Model model, @ModelAttribute("qo") UserQueryObject qo){
        model.addAttribute("pageInfo",userService.query(qo));
        return "/user/list";
    }

}
