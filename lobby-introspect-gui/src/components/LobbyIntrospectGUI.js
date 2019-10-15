/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";

const request = require('superagent');

class LobbyIntrospectGUI extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            instance: ''
        };

        this.getInstance = this.getInstance.bind(this);
    }

    componentDidMount() {
        if (this.state.instance === '') {
            this.getInstance();
        }
    }

    getInstance() {
        request
            .get('/api/v1/config')
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

    render() {
        return (
            <div>
                <p>Lobby Introspect {this.state.instance}</p>
            </div>
        )
    }

}

export default LobbyIntrospectGUI;