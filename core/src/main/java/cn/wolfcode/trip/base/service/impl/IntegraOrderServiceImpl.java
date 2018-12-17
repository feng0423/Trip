package cn.wolfcode.trip.base.service.impl;


import cn.wolfcode.trip.base.domain.IntegraOrder;
import cn.wolfcode.trip.base.mapper.IntegraOrderMapper;
import cn.wolfcode.trip.base.query.IntegraOrderQueryObject;
import cn.wolfcode.trip.base.query.IntegraShoppingQueryObject;
import cn.wolfcode.trip.base.service.IIntegraOrderService;
import cn.wolfcode.trip.base.util.UserContext;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IntegraOrderServiceImpl implements IIntegraOrderService {

    @Autowired
    private IntegraOrderMapper integraOrderMapper;

    /*查询订单所有数据
    * */
    public PageInfo query(IntegraOrderQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List list  = integraOrderMapper.selectForList(qo);
        return new PageInfo(list);
    }

    /**
     * 保存订单
     * @param integraOrder
     */
    public void saveOrUpdate(IntegraOrder integraOrder) {
        if(integraOrder.getId()!=null){

            integraOrderMapper.updateByPrimaryKey(integraOrder);
        }else{
            integraOrder.setUser(UserContext.getUser());//设置作者

            integraOrderMapper.insert(integraOrder);
        }
    }

    /**
     * 删除订单
     * @param id
     */
    public void delete(Long id) {
        integraOrderMapper.deleteByPrimaryKey(id);
    }

    /**
     * 修改订单
     * @param integraOrder
     */
    public void update(IntegraOrder integraOrder) {
        integraOrderMapper.updateByPrimaryKey(integraOrder);
    }

}
