package cn.wolfcode.trip.base.mapper;

import cn.wolfcode.trip.base.domain.User;
import cn.wolfcode.trip.base.domain.UserChat;
import cn.wolfcode.trip.base.query.QueryObject;
import com.github.pagehelper.PageInfo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserChatMapper {
    int deleteByPrimaryKey(Long id);

    int insert(UserChat record);

    UserChat selectByPrimaryKey(Long id);

    List<UserChat> selectAll();

    int updateByPrimaryKey(UserChat record);

    List<UserChat> selectForList(QueryObject qo);

    List<User> listUserById( @Param("senderId") Long id,@Param("receiverId") Long id1);

    List<UserChat> selectNewTime(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId, @Param("newTime") String newTime);
}