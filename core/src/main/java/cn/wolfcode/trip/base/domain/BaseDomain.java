package cn.wolfcode.trip.base.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//抽出表结构的id
public abstract class BaseDomain {

    protected Long id;
}
