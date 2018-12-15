package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Reply;
import cn.wolfcode.trip.base.query.ReplyQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface IReplyService {
    void save(Reply reply);

    void deleteByTargetIdType(ReplyQueryObject qo);

    void  delete(Long id);

    PageInfo<Reply> queryForAppList(ReplyQueryObject qo);
}
