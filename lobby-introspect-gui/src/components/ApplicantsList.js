/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 * See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

import React from "react";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

class ApplicantsList extends React.Component {

    constructor(props) {
        super(props);

        this.linkFormatterBody = this.linkFormatterBody.bind(this);
        this.linkFormatterDelete = this.linkFormatterDelete.bind(this);
        this.dateFormatter = this.dateFormatter.bind(this);
        this.additionalInfoTitleIdFormatter = this.additionalInfoTitleIdFormatter.bind(this);
        this.additionalInfoErrorsFormatter = this.additionalInfoErrorsFormatter.bind(this);
        this.additionalInfoOriginalId = this.additionalInfoOriginalId.bind(this);
    }

    linkFormatterBody(cell) {
        let url = this.props.lobbyServiceUrl + '/v1/api/applicants/' + cell + '/body';
        if (this.props.dbckatMode) {
            url = 'dbckat-hent:' + url
        }
        return `<a href='${url}' target="_blank">Link</a>`
    }

    linkFormatterDelete(cell) {
        let url = this.props.lobbyServiceUrl + '/v1/api/applicants/' + cell + '/state';
        if (this.props.dbckatMode) {
            url = 'dbckat-slet:' + url;
        }
        return `<a href='${url}' target="_blank">Link</a>`
    }

    additionalInfoTitleIdFormatter(cell) {
        if (cell !== undefined && cell.title !== undefined) {
            return cell.title;
        } else {
            return '';
        }
    }

    additionalInfoErrorsFormatter(cell) {
        if (cell !== undefined && cell.errors !== undefined) {
            return cell.errors;
        } else {
            return '';
        }
    }

    additionalInfoOriginalId(cell) {
        if (cell !== undefined && cell.originalRecordId !== undefined) {
            return cell.originalRecordId;
        } else {
            return '';
        }
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
                                striped={true}
                                options={{noDataText: 'Nope'}}>
                    <TableHeaderColumn dataField='id'
                                       isKey={true}
                                       dataSort>Id</TableHeaderColumn>
                    {this.props.category === '' ? // Hide category if a category is specified
                        <TableHeaderColumn dataField='category'>Kategori</TableHeaderColumn> : null}
                    <TableHeaderColumn dataField='state'>Status</TableHeaderColumn>
                    <TableHeaderColumn dataField='timeOfLastModification'
                                       dataSort
                                       dataFormat={this.dateFormatter}>Ajour</TableHeaderColumn>
                    {this.props.category === 'dpf' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoTitleIdFormatter}>Titel</TableHeaderColumn> : null}
                    {this.props.category === 'dpf' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoOriginalId}>Original
                            Id</TableHeaderColumn> : null}
                    {this.props.category === 'dpf' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoErrorsFormatter}>Fejl</TableHeaderColumn> : null}
                    <TableHeaderColumn dataField='id'
                                       dataFormat={this.linkFormatterBody}>Post</TableHeaderColumn>
                    {this.props.dbckatMode ?
                    <TableHeaderColumn dataField='id'
                                       dataFormat={this.linkFormatterDelete}>Slet</TableHeaderColumn> : null }
                </BootstrapTable>
            </div>
        )
    }

}

export default ApplicantsList;