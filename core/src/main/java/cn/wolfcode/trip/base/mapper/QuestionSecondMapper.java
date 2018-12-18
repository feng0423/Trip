package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.QuestionSecond;
import java.util.List;

public interface QuestionSecondMapper {

    /**
     * 删除一条2级回复
     * @param id
     * @return
     */
    int deleteByPrimaryKey(Long id);

    /**
     * 根据1级问题,删除旗下所有2级回复
     * @param questionId
     * @return
     */
    int deleteByQuestionId(Long questionId);

    /**
     * 新增一条回复
     * @param record
     * @return
     */
    int insert(QuestionSecond record);

    /**
     * 根据问题，查询所有回复
     * @param questionId
     * @return
     */
    List<QuestionSecond> selectAllByQuestionId(Long questionId);
}