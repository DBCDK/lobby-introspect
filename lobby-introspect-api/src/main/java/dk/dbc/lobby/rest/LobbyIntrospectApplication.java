package dk.dbc.lobby.rest;

import dk.dbc.lobby.LobbyIntrospectService;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/api")
public class LobbyIntrospectApplication extends Application {
    private static final Set<Class<?>> classes = new HashSet<>();

    static {
        classes.add(LobbyIntrospectService.class);
        classes.add(Status.class);
    }

    @Override
    public Set<Class<?>> getClasses() {
        return classes;
    }

}
