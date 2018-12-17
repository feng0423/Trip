package cn.wolfcode.trip.base.service.impl;


import cn.wolfcode.trip.base.domain.Reply;
import cn.wolfcode.trip.base.mapper.ReplyMapper;
import cn.wolfcode.trip.base.mapper.ReplySecondMapper;
import cn.wolfcode.trip.base.query.ReplyQueryObject;
import cn.wolfcode.trip.base.service.IReplyService;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyServiceImpl implements IReplyService {

    @Autowired
    private ReplyMapper replyMapper;

    private ReplySecondMapper replySecondMapper;

    public void save(Reply reply) {
        reply.setUser(UserContext.getUser());
        replyMapper.insert(reply);
    }

    public void deleteByTargetIdType(ReplyQueryObject qo) {
        replySecondMapper.deleteByParentId(qo.getParentId());
        replyMapper.deleteByTargetId(qo.getType(), qo.getTargetId());
    }

    public void delete(Long id) {
        replyMapper.deleteByPrimaryKey(id);
    }

    public PageInfo<Reply> queryForAppList(ReplyQueryObject qo) {

        PageHelper.startPage(qo.getCurrentPage(), qo.getPageSize(), qo.getOrderBy());
        List<Reply> list = replyMapper.selectAllByTypeTargetId(qo.getType(), qo.getTargetId());

        for(Reply reply :list){
            System.out.println(reply.getReplies());
        }
        return new PageInfo<Reply>(list);

    }

}
