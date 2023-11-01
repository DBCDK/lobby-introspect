package dk.dbc.lobby.rest;

import dk.dbc.lobby.LobbyIntrospectService;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

import java.util.Set;

@ApplicationPath("/api")
public class LobbyIntrospectApplication extends Application {
    private static final Set<Class<?>> classes = Set.of(LobbyIntrospectService.class, Status.class);

    @Override
    public Set<Class<?>> getClasses() {
        return classes;
    }

}
