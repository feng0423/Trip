package cn.wolfcode.trip.base.service;

import cn.wolfcode.trip.base.domain.Strategy;
import cn.wolfcode.trip.base.query.StrategyQueryObject;
import com.github.pagehelper.PageInfo;

import java.util.List;

public interface IStrategyService {
    /**
     * 分页
     * @param qo
     * @return
     */
    PageInfo query(StrategyQueryObject qo);
    /**
     * 新增和编辑
     * @param strategy
     */
    void saveOrUpdate(Strategy strategy);
    /**
     * 查询全部
     * @return
     */
    List<Strategy> listAll();
    /**
     * 根据id查询攻略
     * @param id
     * @return
     */
    Strategy getStrategyById(Long id);



    /**
     * 根据用户ID查询该用户所收藏的攻略
     * @param userId
     */
    List selectStrategyByUserId(Long userId);

    /**
     * 查询攻略查看最多的
     * @return
     */
    List listLook();
}
