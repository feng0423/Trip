package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Attention;
import cn.wolfcode.trip.base.domain.Tag;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

public interface IAttentionService {

    /**
     * 新增关系
     * @param visitorId //访客
     * @param authorId //作者
     */
    void attention(Long visitorId , Long authorId);

    /**
     * 通过关系查询是否关联
     * @param visitorId
     * @param authorId
     * @return
     */
    Attention gatAttention(Long visitorId, Long authorId);

    /**
     * 取消关注,删除关系
     * @param visitorId
     * @param authorId
     */
    void DeleteAttention(Long visitorId, Long authorId);

    /**
     * 查询关注和粉丝的数量
     * @param userId
     * @return
     */
    Map<String,Object> selectAttentionByUserId(Long userId);

}
