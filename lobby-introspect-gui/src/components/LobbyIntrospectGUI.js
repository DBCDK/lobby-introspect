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
            category: '',
            applicantState: 'PENDING', // Calling it 'state' could lead to confusion
            applicants: [],
            showHeader: true
        };

        this.setShowHeader = this.setShowHeader.bind(this);
        this.getInstance = this.getInstance.bind(this);
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

        let showHeader = queryParams.showHeader;
        if (showHeader !== undefined) {
            this.setShowHeader(showHeader);
        }

        if (this.state.instance === '') {
            this.getInstance();
        }

        this.getApplicants(category, applicantState);
    }

    setShowHeader(showHeader) {
        this.setState({showHeader: showHeader !== 'false'})
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
                    {this.state.showHeader ? <LobbyIntrospectHeader instance={this.state.instance}/> : ''}
                </div>
                <div>
                    <ApplicantsList
                        category={this.state.category}
                        applicationState={this.state.applicantState}
                        applicants={this.state.applicants}/>}
                </div>
            </div>
        )
    }

}

export default LobbyIntrospectGUI;