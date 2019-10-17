/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";

class LobbyIntrospectHeader extends React.Component {

    render() {
        return (
            <div>
                <div>
                    <h2 style={{marginTop: '10px'}}>Lobby Introspect <b>{this.props.instance}</b></h2>
                </div>
                <hr/>
            </div>
        )
    }
}

export default LobbyIntrospectHeader;