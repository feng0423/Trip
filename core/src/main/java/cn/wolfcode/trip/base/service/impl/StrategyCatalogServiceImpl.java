package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.StrategyCatalog;
import cn.wolfcode.trip.base.mapper.StrategyCatalogMapper;
import cn.wolfcode.trip.base.query.StrategyCatalogQueryObject;
import cn.wolfcode.trip.base.service.IStrategyCatalogService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StrategyCatalogServiceImpl implements IStrategyCatalogService {

    @Autowired
    private StrategyCatalogMapper strategyCatalogMapper;

    public PageInfo query(StrategyCatalogQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List list  = strategyCatalogMapper.selectForList(qo);
        return new PageInfo(list);
    }

    public void saveOrUpdate(StrategyCatalog strategyCatalog) {
        //如果没有序号
        System.out.println(strategyCatalog.getSequence());
        if(strategyCatalog.getSequence()==null){
            //就查询最大的序号+ 1 进行设置
            int maxSequence = strategyCatalogMapper.getMaxSequence(strategyCatalog.getStrategy().getId());
            strategyCatalog.setSequence(maxSequence+1);
        }
        if(strategyCatalog.getId()!=null){
            strategyCatalogMapper.updateByPrimaryKey(strategyCatalog);
        }else{
            strategyCatalogMapper.insert(strategyCatalog);
        }
    }

    public List<StrategyCatalog> listByStrategyId(Long  strategyId) {

        return strategyCatalogMapper.selectByStrategyId(strategyId);
    }
}
