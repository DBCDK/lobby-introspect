package dk.dbc.lobby;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.util.StopwatchInterceptor;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.interceptor.Interceptors;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Interceptors(StopwatchInterceptor.class)
@Stateless
@Path("")
public class LobbyIntrospectService {
    private static final Logger LOGGER = LoggerFactory.getLogger(LobbyIntrospectService.class);
    private final ObjectMapper mapper = new ObjectMapper();

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
        LOGGER.info("v1/applicants?category={}&state={}", category, state);
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

            res = mapper.writeValueAsString(applicants);

            return Response.ok(res, MediaType.APPLICATION_JSON).build();
        } catch (JsonProcessingException | LobbyConnectorException e) {
            LOGGER.error(e.getMessage());
            return Response.serverError().build();
        }
    }

}
