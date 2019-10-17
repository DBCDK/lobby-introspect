FROM docker.dbc.dk/payara5-micro:latest

LABEL INSTANCE="Name of the instance of this lobby introspect. Typically the name of the environment e.g. FBStest"
LABEL LOBBY_SERVICE_URL="URL for the lobby service. E.g. http://lobby-service.metascrum-staging.svc.cloud.dbc.dk"

USER root

COPY lobby-introspect-api/target/lobby-introspect-api-*.war app.json deployments/