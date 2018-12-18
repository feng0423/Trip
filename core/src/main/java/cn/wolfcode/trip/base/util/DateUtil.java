package cn.wolfcode.trip.base.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public abstract class DateUtil {
    public static Date zeroTime() throws ParseException {
        Date time = new Date();
        SimpleDateFormat simp= new SimpleDateFormat("yyyy-MM-dd 00:00:00");
        SimpleDateFormat simp2= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return simp2.parse(simp.format(time));
    }
    
    public static String getDateString(Date createTime) throws ParseException {
        if (createTime==null)
            return "";
        // 今日零时的date对象
        Date todayZero = DateUtil.zeroTime();
        int days = (int) ((todayZero.getTime() - createTime.getTime()) / (1000 * 3600 * 24));
        if (days > 1){
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            return sdf.format(createTime);
        }else if (days == 1){
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
            return "前天 " + sdf.format(createTime);
        }else if (days <= 0){
            if (todayZero.before(createTime) ){
                // 今日
                SimpleDateFormat sdf = new SimpleDateFormat("a hh:mm");
                return sdf.format(createTime);
            }else{
                // 昨天
                SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
                return "昨天 " + sdf.format(createTime);
            }

        }
        return null;

    }
}
