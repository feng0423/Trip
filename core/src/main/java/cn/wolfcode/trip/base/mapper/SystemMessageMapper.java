package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.SystemMessage;
import java.util.List;

public interface SystemMessageMapper {
    int deleteByPrimaryKey(Long id);

    int insert(SystemMessage record);

    SystemMessage selectByPrimaryKey(Long id);

    List<SystemMessage> selectAll();

    int updateByPrimaryKey(SystemMessage record);
}