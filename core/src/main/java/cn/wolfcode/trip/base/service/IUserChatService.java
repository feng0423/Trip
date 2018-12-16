package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.domain.UserChat;
import cn.wolfcode.trip.base.query.NewsQueryObject;
import cn.wolfcode.trip.base.query.QueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface IUserChatService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(QueryObject qo);
    /**
     * 新增和编辑
     * @param
     */
    void saveOrUpdate(UserChat userChat);
    /**
     * 查询全部
     * @return
     */
    List<UserChat> listAll();


    /**
     * 根据id查询内容
     * @param id
     * @return
     */
    UserChat getById(Long id);


    List<User> listUserById(Long id, Long id1);

    int insert(UserChat record);

    List<UserChat> getNewMessage(Long receiverId, Long senderId,String newTime);
}
