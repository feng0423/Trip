package cn.wolfcode.trip.base.service.impl;


import cn.wolfcode.trip.base.domain.Reply;
import cn.wolfcode.trip.base.domain.ReplySecond;
import cn.wolfcode.trip.base.mapper.ReplyMapper;
import cn.wolfcode.trip.base.mapper.ReplySecondMapper;
import cn.wolfcode.trip.base.query.ReplyQueryObject;
import cn.wolfcode.trip.base.service.IReplySecondService;
import cn.wolfcode.trip.base.service.IReplyService;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplySecondServiceImpl implements IReplySecondService {

    @Autowired
    private ReplySecondMapper replySecondMapper;


    public void save(ReplySecond replySecond) {
        replySecond.setUser(UserContext.getUser());
        replySecondMapper.insert(replySecond);
    }


}
