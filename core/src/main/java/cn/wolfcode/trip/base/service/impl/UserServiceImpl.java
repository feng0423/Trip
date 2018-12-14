package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.mapper.UserMapper;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.service.IUserService;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements IUserService{

    @Autowired
    private UserMapper userMapper;

    public PageInfo<User> query(QueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List<User> list = userMapper.selectForList(qo);
        return new PageInfo<User>(list);
    }

    public void register(User user) {
        //检查邮箱是否已经被注册
        User temp = userMapper.selectByEmailAndPassword(user.getEmail(),null);
            //如果被注册就抛异常,并在控制器将异常响应到ajax中去,并提醒用户
            if(temp != null){
                throw new RuntimeException("亲,邮箱已被注册");
            }
        //不存在,那么可以注册即将数据保存到数据库
            //设置默认头像封面
            user.setHeadImgUrl("img/user/head.jpg");
            //设置性别默认
            user.setGender(User.secret);
            //设置默认的封面
            user.setCoverImgUrl("img/user/bg.jpeg");
            //将数据存放在数据库中
            userMapper.insert(user);
    }

    public User login(String email, String password) {
        //通过账号和密码到数据库中查询的user用户,如果不存在,抛异常,
        //如果存在就返回user,并将user共享到session中
        User user = userMapper.selectByEmailAndPassword(email, password);
        if(user == null){
            throw new RuntimeException("亲,邮箱或者密码不匹配");
        }
        UserContext.setUser(user);
        return user;
    }

    public void update(User user) {
        userMapper.updateByPrimaryKey(user);
    }

    public List<User> selectAll() {
        return userMapper.selectAll();
    }
}
