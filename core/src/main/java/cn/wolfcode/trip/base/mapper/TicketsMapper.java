package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.Tickets;
import cn.wolfcode.trip.base.query.TicketsQueryObject;

import java.util.List;

public interface TicketsMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Tickets record);

    Tickets selectByPrimaryKey(Long id);

    List<Tickets> selectAll();

    int updateByPrimaryKey(Tickets record);

    List<Tickets> selectForList(TicketsQueryObject qo);

}