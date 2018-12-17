package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.CircleOfFriends;
import cn.wolfcode.trip.base.query.CircleOfFriendsQueryObject;

import java.util.List;

public interface CircleOfFriendsMapper {
    int deleteByPrimaryKey(Long id);

    int insert(CircleOfFriends record);

    CircleOfFriends selectByPrimaryKey(Long id);

    List<CircleOfFriends> selectAll();

    List selectForList(CircleOfFriendsQueryObject qo);

}