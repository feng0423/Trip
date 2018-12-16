package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.domain.UserChat;
import cn.wolfcode.trip.base.query.QueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface IUserService {


    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo<User> query(QueryObject qo);
    /**
     * 注册用户
     * @param user
     */
    void register(User user);
    /**
     * 登陆
     * @param email
     * @param password
     */
    User login(String email, String password);
    /**
     * 更新
     * @param user
     */
    void update(User user);

    /**
     * 查询所有user
     */
    List<User> selectAll();

    /**
     * 获取私信的人
     * @param id
     * @return
     */
    List<User> listUserById(Long id);

    User selectByUser(Long id);
}
