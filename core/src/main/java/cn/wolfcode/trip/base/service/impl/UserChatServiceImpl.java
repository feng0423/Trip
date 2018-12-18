package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.News;
import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.domain.UserChat;
import cn.wolfcode.trip.base.mapper.UserChatMapper;
import cn.wolfcode.trip.base.query.QueryObject;
import cn.wolfcode.trip.base.service.IUserChatService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
@Service

public class UserChatServiceImpl implements IUserChatService {
    @Autowired
    private UserChatMapper userChatMapper;

    @Override
    public PageInfo<UserChat> query(QueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List<UserChat> list =  userChatMapper.selectForList(qo);
        return new PageInfo<UserChat>(list);
    }
    @Override
    public void saveOrUpdate(UserChat userChat) {
        userChatMapper.updateByPrimaryKey(userChat);
    }

    @Override
    public List<UserChat> listAll() {
        return userChatMapper.selectAll();
    }

    @Override
    public UserChat getById(Long id) {
        return userChatMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<User> listUserById(Long id, Long id1) {
        return userChatMapper.listUserById(id,id1);
    }

    @Override
    public int insert(UserChat userChat) {
        userChat.setSendTime(new Date());
        userChat.setStatus(1);
        return userChatMapper.insert(userChat);
    }

    @Override
    public List<UserChat> getNewMessage(Long receiverId, Long senderId,String newTime) {


        return userChatMapper.selectNewTime(receiverId,senderId,newTime);
    }

    @Override
    public int selectUnreads(Long senderId) {

        return userChatMapper.selectUnreadsNum(senderId);
    }

    /**
     * 设置状态为已读
     * @param senderId
     * @param receiverId
     */
    @Override
    public void setStatus(Long senderId, Long receiverId) {
        if(receiverId!=senderId){

        }
        userChatMapper.setStatus(senderId,receiverId);
    }

}
