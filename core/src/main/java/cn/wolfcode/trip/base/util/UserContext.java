package cn.wolfcode.trip.base.util;

import cn.wolfcode.trip.base.domain.User;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpSession;
import java.util.Set;

public class UserContext {

    private static final String USER_IN_SESSION = "USER_IN_SESSION";
    private static final String EXPRESSION_IN_SESSION = "EXPRESSION_IN_SESSION";

    public static HttpSession getSession() {
        return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .getRequest().getSession();
    }

    public static void setUser(User currentUser) {
        if (currentUser == null) {
            getSession().invalidate();
        } else {
            getSession().setAttribute(USER_IN_SESSION, currentUser);
        }
    }

    public static void setUseExpressions(Set<String> expressions) {
        getSession().setAttribute(EXPRESSION_IN_SESSION, expressions);
    }

    public static User getUser() {
        return (User) getSession().getAttribute(USER_IN_SESSION);
    }

    public static Set<String> getExpressions() {
        return (Set<String>) getSession().getAttribute(EXPRESSION_IN_SESSION);
    }

}
