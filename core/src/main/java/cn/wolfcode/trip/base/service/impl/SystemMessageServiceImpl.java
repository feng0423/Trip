package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.SystemMessage;
import cn.wolfcode.trip.base.mapper.SystemMessageMapper;
import cn.wolfcode.trip.base.service.ISystemMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SystemMessageServiceImpl implements ISystemMessageService {
    @Autowired
    private SystemMessageMapper systemMessageMapper;

    public int deleteByPrimaryKey(Long id) {
        return systemMessageMapper.deleteByPrimaryKey(id);
    }

    public int insert(SystemMessage record) {
        return systemMessageMapper.insert(record);
    }

    public SystemMessage selectByPrimaryKey(Long id) {
        return systemMessageMapper.selectByPrimaryKey(id);
    }

    public List<SystemMessage> selectAll() {
        return systemMessageMapper.selectAll();
    }

    public int updateByPrimaryKey(SystemMessage record) {
        return systemMessageMapper.updateByPrimaryKey(record);
    }
}
