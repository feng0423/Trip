package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Strategy;
import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.query.SerachQueryObject;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {

    //插入
    int insert(User record);

    //查询
    User selectByPrimaryKey(Long id);

    //查询所有
    List<User> selectAll();

    //更新
    int updateByPrimaryKey(User record);

    //查询结果集
    List<User> selectForList(QueryObject qo); //查询结果集

    User selectByEmailAndPassword(@Param("email") String email, @Param("password") String password);


    List<User> listUserById(@Param("id") Long id);


    List<Strategy> selectSearchForList(SerachQueryObject qo);
}