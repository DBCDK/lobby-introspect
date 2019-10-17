/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

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
