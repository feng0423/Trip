package cn.wolfcode.trip.base.service.impl;


import cn.wolfcode.trip.base.domain.IntegraShopping;
import cn.wolfcode.trip.base.mapper.IntegraShoppingMapper;
import cn.wolfcode.trip.base.query.IntegraShoppingQueryObject;
import cn.wolfcode.trip.base.service.IIntegraShoppingService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IntegraShoppingServiceImpl implements IIntegraShoppingService {

    @Autowired
    private IntegraShoppingMapper integraShoppingMapper;

    /*查询订单所有数据
    * */
    public PageInfo query(IntegraShoppingQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List list  = integraShoppingMapper.selectForList(qo);
        return new PageInfo(list);
    }

    /**
     * 保存订单
     * @param integraShopping
     */
    public void saveOrUpdate(IntegraShopping integraShopping) {
        if(integraShopping.getId()!=null){

            integraShoppingMapper.updateByPrimaryKey(integraShopping);
        }else{
            //integraShopping.setUser(UserContext.getUser());//设置作者

            integraShoppingMapper.insert(integraShopping);
        }
    }

    /**
     * 删除订单
     * @param id
     */
    public void delete(Long id) {
        integraShoppingMapper.deleteByPrimaryKey(id);
    }

    /**
     * 修改订单
     * @param integraShopping
     */
    public void update(IntegraShopping integraShopping) {
        integraShoppingMapper.updateByPrimaryKey(integraShopping);
    }

    public IntegraShopping get(Long id) {

        return integraShoppingMapper.selectByPrimaryKey(id);
    }

}
