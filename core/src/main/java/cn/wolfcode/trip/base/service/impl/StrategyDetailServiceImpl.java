package cn.wolfcode.trip.base.service.impl;

import cn.wolfcode.trip.base.domain.StrategyContent;
import cn.wolfcode.trip.base.domain.StrategyDetail;
import cn.wolfcode.trip.base.mapper.StrategyContentMapper;
import cn.wolfcode.trip.base.mapper.StrategyDetailMapper;
import cn.wolfcode.trip.base.query.StrategyDetailQueryObject;
import cn.wolfcode.trip.base.service.IStrategyDetailService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class StrategyDetailServiceImpl implements IStrategyDetailService{

    @Autowired
    private StrategyDetailMapper strategyDetailMapper;
    @Autowired
    private StrategyContentMapper strategyContentMapper;

    public void saveOrUpdate(StrategyDetail strategyDetail) {
        //如果没有序号
        if (strategyDetail.getSequence()==null && strategyDetail.getCatalog()!=null){
            //就查询最大的序号+1进行设置
            int maxSequence = strategyDetailMapper.getMaxSequence(strategyDetail.getCatalog().getId());
            strategyDetail.setSequence(maxSequence+1);
        }
        //判断是否发布状态,如果是就设置发布时间
        if(strategyDetail.getState()==StrategyDetail.STATE_RELEASE){
            strategyDetail.setReleaseTime(new Date());
        }
        StrategyContent content = strategyDetail.getStrategyContent();
        if(strategyDetail.getId()!=null){
            strategyDetailMapper.updateByPrimaryKey(strategyDetail);
            //编辑也是需要将文本的内容更新do数据库
            Long contentId = strategyDetail.getId();
            content.setId(contentId);
            strategyContentMapper.updateByPrimaryKey(content);
        }else{
            //如果新增就创建插入创建时间
            strategyDetail.setCreateTime(new Date());
            strategyDetailMapper.insert(strategyDetail);
            //还需要把文本的内容插入到数据库
            content.setId(strategyDetail.getId());
            strategyContentMapper.insert(content);
        }
    }

    public StrategyContent getContentById(Long id) {
        return strategyContentMapper.selectByPrimaryKey(id);
    }

    public StrategyDetail getByDetailId(Long id) {
        return strategyDetailMapper.selectByPrimaryKey(id);
    }

    public PageInfo query(StrategyDetailQueryObject qo) {
        PageHelper.startPage(qo.getCurrentPage(),qo.getPageSize());
        List list = strategyDetailMapper.selectForList(qo);
        return new PageInfo(list);
    }
}
