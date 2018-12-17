package cn.wolfcode.trip.base.domain;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter

public class IntegraOrder extends BaseDomain{

    private User user;

    private String  contactName;

    private String contactNumber;
    private String shippingAddress;
    private IntegraShopping integrashopping;
    private BigDecimal integrasum;

}