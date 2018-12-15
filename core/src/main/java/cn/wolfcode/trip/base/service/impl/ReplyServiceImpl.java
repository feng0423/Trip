package cn.wolfcode.trip.base.service.impl;


import cn.wolfcode.trip.base.domain.Reply;
import cn.wolfcode.trip.base.mapper.ReplyMapper;
import cn.wolfcode.trip.base.query.ReplyQueryObject;
import cn.wolfcode.trip.base.service.IReplyService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyServiceImpl implements IReplyService {

    @Autowired
    private ReplyMapper replyMapper;

    public void save(Reply reply) {
        replyMapper.insert(reply);
    }

    public void deleteByTargetIdType(ReplyQueryObject qo) {
        replyMapper.deleteByTargetId(qo.getType(), qo.getTargetId());
    }

    public void delete(Long id) {
        replyMapper.deleteByPrimaryKey(id);
    }

    public PageInfo<Reply> queryForAppList(ReplyQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(), qo.getPageSize());
        List<Reply> list = replyMapper.selectAllByTypeTargetId(qo.getType(), qo.getTargetId());
        return new PageInfo<Reply>(list);
    }

}
