FROM docker.dbc.dk/payara5-micro:latest

LABEL INSTANCE="Name of the instance of this lobby introspect. Typically the name of the environment e.g. FBStest"

USER root

COPY lobby-introspect-api/target/lobby-introspect-api-*.war app.json deployments/