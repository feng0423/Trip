package cn.wolfcode.trip.base.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class Sign extends BaseDomain{

    private User user;

    private Date addTime;

    private Integer score;

    private Integer count;
}