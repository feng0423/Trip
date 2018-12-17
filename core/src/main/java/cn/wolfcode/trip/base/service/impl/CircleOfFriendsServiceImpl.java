package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.CircleOfFriends;
import cn.wolfcode.trip.base.mapper.CircleOfFriendsMapper;
import cn.wolfcode.trip.base.query.CircleOfFriendsQueryObject;
import cn.wolfcode.trip.base.service.ICircleOfFriendsService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;


@Service
public class CircleOfFriendsServiceImpl implements ICircleOfFriendsService {

    @Autowired
    private CircleOfFriendsMapper circleOfFriendsMapper;


    public PageInfo query(CircleOfFriendsQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize(),qo.getOrderBy());
        List list  = circleOfFriendsMapper.selectForList(qo);
        return new PageInfo(list);
    }

    public void save(CircleOfFriends circleOfFriends) {
        circleOfFriendsMapper.insert(circleOfFriends);
    }

    public PageInfo queryCircleOfFriendssByUserId(CircleOfFriendsQueryObject qo) {
        return null;
    }


}
