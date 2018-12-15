package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Sign;

import java.util.List;

public interface ISignService {

    List<Sign> getSignsByUserId(Long  userId) ;

    void saveSignInfo(Sign sign);

    int selectUserState(Long id);

    int selectUserScore(Long id);
}
