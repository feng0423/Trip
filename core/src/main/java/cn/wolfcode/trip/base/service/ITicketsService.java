package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Tickets;
import cn.wolfcode.trip.base.query.TicketsQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface ITicketsService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(TicketsQueryObject qo);
    /**
     * 新增和编辑
     * @param tickets
     */
    void saveOrUpdate(Tickets tickets);

    void delete(Long id);

    /**
     * 修改门票
     *
     */
    void update(Tickets tickets);

    /**
     * 查询对应id
     */
    Tickets get(Long id);
}
