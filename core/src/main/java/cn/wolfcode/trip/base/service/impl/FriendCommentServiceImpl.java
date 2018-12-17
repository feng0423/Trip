package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.FriendComment;
import cn.wolfcode.trip.base.mapper.FriendCommentMapper;
import cn.wolfcode.trip.base.service.IFriendCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class FriendCommentServiceImpl implements IFriendCommentService {

    @Autowired
    private FriendCommentMapper friendCommentMapper;

    public void save(FriendComment friendComment) {
        friendCommentMapper.insert(friendComment);
    }
    


}
