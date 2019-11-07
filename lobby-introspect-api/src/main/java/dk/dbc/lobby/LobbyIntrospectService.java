/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

package dk.dbc.lobby;

import dk.dbc.jsonb.JSONBContext;
import dk.dbc.jsonb.JSONBException;
import dk.dbc.util.StopwatchInterceptor;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.interceptor.Interceptors;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Interceptors(StopwatchInterceptor.class)
@Stateless
@Path("")
public class LobbyIntrospectService {
    private static final Logger LOGGER = LoggerFactory.getLogger(LobbyIntrospectService.class);
    private final JSONBContext mapper = new JSONBContext();

    @Inject
    LobbyConnector lobbyConnector;

    @Inject
    @ConfigProperty(name = "INSTANCE", defaultValue = "")
    private String INSTANCE;

    @Inject
    @ConfigProperty(name = "LOBBY_SERVICE_URL", defaultValue = "")
    private String LOBBY_SERVICE_URL;

    @GET
    @Produces({MediaType.TEXT_PLAIN})
    @Path("v1/instance")
    public Response getInstance() {
        return Response.ok(INSTANCE).build();
    }

    @GET
    @Produces({MediaType.TEXT_PLAIN})
    @Path("v1/lobby")
    public Response getLobbyServiceUrl() {
        return Response.ok(LOBBY_SERVICE_URL).build();
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("v1/applicants")
    public Response getApplicants(@QueryParam("category") String category,
                                  @DefaultValue("PENDING") @QueryParam("state") String state) {
        String res;

        try {
            final LobbyConnector.Params params = new LobbyConnector.Params();
            if (!"".equals(category)) {
                params.withCategory(category);
            }

            if (!"".equals(state)) {
                params.withState(LobbyConnector.Params.State.valueOf(state));
            } else {
                params.withState(LobbyConnector.Params.State.PENDING);
            }

            final Applicant[] applicants = lobbyConnector.getApplicants(params);

            res = mapper.marshall(applicants);

            return Response.ok(res, MediaType.APPLICATION_JSON).build();
        } catch (JSONBException | LobbyConnectorException e) {
            LOGGER.error(e.getMessage());
            return Response.serverError().build();
        }
    }

}
