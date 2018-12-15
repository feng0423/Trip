package cn.wolfcode.trip.base.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class Sign extends BaseDomain{

    private Long userId;

    private Date addTime;

    private Integer score;

    private Integer count;

    private Integer signCount;
}