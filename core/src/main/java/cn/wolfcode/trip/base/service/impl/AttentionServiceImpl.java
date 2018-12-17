package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.Attention;
import cn.wolfcode.trip.base.domain.Tag;
import cn.wolfcode.trip.base.mapper.AttentionMapper;
import cn.wolfcode.trip.base.service.IAttentionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttentionServiceImpl implements IAttentionService {

    @Autowired
    private AttentionMapper attentionMapper;


    public void attention(Long visitorId , Long authorId) {
        Attention attention = new Attention();
        attention.setAuthorId(authorId);
        attention.setVisitorId(visitorId);
        attentionMapper.insert(attention);
    }

    public Attention gatAttention(Long visitorId, Long authorId) {

        return attentionMapper.gatAttention(visitorId,authorId);
    }

    public void DeleteAttention(Long visitorId, Long authorId) {
        attentionMapper.delete(visitorId,authorId);
    }

    public Map<String, Object> selectAttentionByUserId(Long userId) {
        //根据用户ID查询用户有多少人关注
        int attentionNub = attentionMapper.selectAttention(userId);//关注
        //根据用户ID查询用户有多人粉丝
        int fansNub = attentionMapper.selectFans(userId);//粉丝
        HashMap map = new HashMap();
        map.put("attention",attentionNub);
        map.put("fans",fansNub);
        return map;
    }
}
