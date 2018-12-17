package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.CircleOfFriends;
import cn.wolfcode.trip.base.query.CircleOfFriendsQueryObject;
import cn.wolfcode.trip.base.query.UserQueryObject;
import com.github.pagehelper.PageInfo;

public interface ICircleOfFriendsService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(CircleOfFriendsQueryObject qo);
    /**
     * 新增
     * @param circleOfFriends
     * @return
     */
    void save(CircleOfFriends circleOfFriends);

    /**
     * 根据用户ID查询出所有该用户的评论
     * @param qo
     * @return
     */
    PageInfo queryCircleOfFriendssByUserId(CircleOfFriendsQueryObject qo);



}
