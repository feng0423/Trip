package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Region;
import cn.wolfcode.trip.base.domain.SystemMessage;

import java.util.List;

public interface ISystemMessageService {

    int deleteByPrimaryKey(Long id);

    int insert(SystemMessage record);

    SystemMessage selectByPrimaryKey(Long id);

    List<SystemMessage> selectAll();

    int updateByPrimaryKey(SystemMessage record);

}
