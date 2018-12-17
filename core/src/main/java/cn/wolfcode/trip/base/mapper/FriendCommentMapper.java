package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.FriendComment;
import java.util.List;

public interface FriendCommentMapper {
    int deleteByPrimaryKey(Long id);

    int insert(FriendComment record);

    FriendComment selectByPrimaryKey(Long id);

    List<FriendComment> selectAll();

    int updateByPrimaryKey(FriendComment record);
}