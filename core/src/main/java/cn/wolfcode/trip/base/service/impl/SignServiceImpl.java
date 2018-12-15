package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.Sign;
import cn.wolfcode.trip.base.mapper.SignMapper;
import cn.wolfcode.trip.base.service.ISignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SignServiceImpl implements ISignService {

    @Autowired
    private SignMapper signMapper;

    public List<Sign> getSignsByUserId(Long userId) {
        return signMapper.selectByUserId(userId);
    }

    public void saveSignInfo(Sign sign) {

        int status = signMapper.selectUserState(sign.getUserId());
        if(status == 0){
            //创建时间插入时间
            sign.setAddTime(new Date());
            //插入当前签到状态
            sign.setSignCount(1);
            //插入连续签到的次数
            //查询签到的次数
            //查询昨天的是否签到
            int hasSign = signMapper.getSignByUserId(sign.getUserId());
            //如果签到获取当前的count值
            if(hasSign ==0 ){
                //插入1
                sign.setCount(1);
            }else{
                //查询昨天的次数
                Integer count = signMapper.getCountByUserId(sign.getUserId());
                sign.setCount(count+1);
            }
            //插入当前用户的id
            sign.setUserId(sign.getUserId());
            //插入分数
            //查询分数
            Integer score = signMapper.getScoreByUserId(sign.getUserId());
            sign.setScore(score+5);
            signMapper.insert(sign);

        } else{

        }


    }

    public int selectUserState(Long id) {
        return signMapper.selectUserState(id);
    }

    public int selectUserScore(Long id) {
        return signMapper.getScoreByUserId(id);
    }
}
