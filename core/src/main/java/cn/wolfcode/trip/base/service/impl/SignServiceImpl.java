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

    public void saveSignInfo(Long userId) {


        Sign sign = new Sign();
        sign.setAddTime(new Date());
        //sign.setCount();
        //signMapper.
    }
}
