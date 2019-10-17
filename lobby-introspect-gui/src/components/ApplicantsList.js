/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

class ApplicantsList extends React.Component {

    constructor(props) {
        super(props);

        this.linkFormatter = this.linkFormatter.bind(this);
        this.dateFormatter = this.dateFormatter.bind(this);
        this.additionalInfoLocalIdFormatter = this.additionalInfoLocalIdFormatter.bind(this);
        this.additionalInfoErrorsFormatter = this.additionalInfoErrorsFormatter.bind(this);
    }

    linkFormatter(cell) {
        return `<a href='${cell}' target="_blank">Link</a>`
    }

    additionalInfoLocalIdFormatter(cell) {
        return cell.localId;
    }

    additionalInfoErrorsFormatter(cell) {
        return cell.errors;
    }

    dateFormatter(cell) {
        let dateValue = new Date(cell);

        // Used for making date and time segments two chars long.
        let leftPad2 = function (val) {
            return ("00" + val).slice(-2)
        };

        return dateValue.getFullYear() +
            '-' + leftPad2(dateValue.getMonth() + 1) +
            '-' + leftPad2(dateValue.getDate()) +
            ' ' + leftPad2(dateValue.getHours()) +
            ':' + leftPad2(dateValue.getMinutes()) +
            ':' + leftPad2(dateValue.getSeconds());
    };

    render() {
        return (
            <div>
                <p>Filter: Kategori = <b>{this.props.category === '' ? 'Alle' : this.props.category}</b> | Status
                    = <b>{this.props.applicationState}</b></p>
                <BootstrapTable data={this.props.applicants}
                                options={{noDataText: 'Nope'}}>
                    <TableHeaderColumn dataField='id'
                                       isKey={true}
                                       dataSort>Id</TableHeaderColumn>
                    {this.props.category === '' ? // Hide category if a category is specified
                        <TableHeaderColumn dataField='category'>Kategori</TableHeaderColumn> : null}
                    <TableHeaderColumn dataField='mimetype'>Mimetype</TableHeaderColumn>
                    <TableHeaderColumn dataField='state'>Status</TableHeaderColumn>
                    <TableHeaderColumn dataField='timeOfLastModification'
                                       dataSort
                                       dataFormat={this.dateFormatter}>Ajour</TableHeaderColumn>
                    {this.props.category === 'bpf' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoLocalIdFormatter}>Lokal id</TableHeaderColumn> : null}
                    {this.props.category === 'bpf' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoErrorsFormatter}>Fejl</TableHeaderColumn> : null}
                    <TableHeaderColumn dataField='bodyLink'
                                       dataFormat={this.linkFormatter}>Post</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }

}

export default ApplicantsList;