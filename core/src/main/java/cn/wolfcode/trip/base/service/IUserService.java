package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.query.QueryObject;
import com.github.pagehelper.PageInfo;

public interface IUserService {


    //分页查询
    PageInfo<User> query(QueryObject qo);

    void register(User user);

    User login(String email, String password);

    void update(User user);
}
