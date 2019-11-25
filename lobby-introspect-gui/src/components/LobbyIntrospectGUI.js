/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";
import ApplicantsList from "./ApplicantsList";
import LobbyIntrospectHeader from "./LobbyIntrospectHeader";

const request = require('superagent');

class LobbyIntrospectGUI extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            instance: '',
            lobbyServiceUrl: '',
            category: '',
            applicantState: 'PENDING', // Calling it 'state' could lead to confusion
            applicants: [],
            dbckatMode: false
        };

        this.setDBCKatMode = this.setDBCKatMode.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.getLobbyServiceUrl = this.getLobbyServiceUrl.bind(this);
        this.getApplicants = this.getApplicants.bind(this);
        this.getURLParams = this.getURLParams.bind(this);
    }

    componentDidMount() {
        const queryParams = this.getURLParams();

        let category = queryParams.category;
        if (category === undefined) {
            category = this.state.category;
        }

        let applicantState = queryParams.state;
        if (applicantState === undefined) {
            applicantState = this.state.applicantState;
        }

        let dbckatMode = queryParams.dbckat;
        if (dbckatMode !== undefined) {
            this.setDBCKatMode(dbckatMode);
        }

        if (this.state.instance === '') {
            this.getInstance();
        }

        if (this.state.lobbyServiceUrl === '') {
            this.getLobbyServiceUrl();
        }

        this.getApplicants(category, applicantState);
    }

    setDBCKatMode(dbckatMode) {
        this.setState({dbckatMode: dbckatMode !== 'false'})
    }

    getInstance() {
        request
            .get('/api/v1/instance')
            .set('Content-Type', 'text/plain')
            .then(res => {
                const instance = res.text;
                this.setState({
                    instance: instance
                });
                document.title = "Lobby Introspect " + instance;
            })
            .catch(err => {
                alert(err.message);
            });
    }

    getLobbyServiceUrl() {
        request
            .get('/api/v1/lobby')
            .set('Content-Type', 'text/plain')
            .then(res => {
                const url = res.text;
                this.setState({
                    lobbyServiceUrl: url
                });
            })
            .catch(err => {
                alert(err.message);
            });
    }

    getApplicants(category, state) {
        const params = {state: state, category: category};

        request
            .get('/api/v1/applicants')
            .set('Accepts', 'application/json')
            .query(params)
            .then(res => {
                const applicants = res.body;
                this.setState({
                    applicants: applicants,
                    category: category,
                    applicantState: state
                });
            })
            .catch(err => {
                alert(err.message);
            });
    }

    getURLParams() {
        const windowLocation = window.location.search;
        const urlParamsList = windowLocation.substring(1).split('&');

        const urlParamsDict = {};

        urlParamsList.forEach(function (item, index) {
            const split = item.split('=');
            const key = split[0];
            const value = split[1];

            // Ignore weird empty key
            if (key !== "") {
                urlParamsDict[key] = value;
            }
        });

        return urlParamsDict;
    }

    render() {
        return (
            <div>
                <div>
                    {!this.state.dbckatMode ? <LobbyIntrospectHeader instance={this.state.instance}/> : ''}
                </div>
                <div>
                    <ApplicantsList
                        dbckatMode={this.state.dbckatMode}
                        lobbyServiceUrl={this.state.lobbyServiceUrl}
                        category={this.state.category}
                        applicantState={this.state.applicantState}
                        applicants={this.state.applicants}/>
                </div>
            </div>
        )
    }

}

export default LobbyIntrospectGUI;