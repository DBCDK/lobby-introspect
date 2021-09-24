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
        this.additionalInfoOriginalIdFormatter = this.additionalInfoOriginalIdFormatter.bind(this);
        this.additionalInfoNameFormatter = this.additionalInfoNameFormatter(this);
        this.additionalInfoAddressFormatter = this.additionalInfoAddressFormatter(this);
    }

    linkFormatterBody(cell) {
        let url;
        if (this.props.dbckatMode) {
            url = 'dbckat-get:' + cell;
        } else {
            url = this.props.lobbyServiceUrl + '/v1/api/applicants/' + cell + '/body';
        }

        return `<a href='${url}'>Link</a>`
    }

    linkFormatterDelete(cell) {
        let url;
        if (this.props.dbckatMode) {
            url = 'dbckat-setstate:' + cell;
        } else {
            // This isn't really necessary as delete link is only shown in dbckat mode
            url = this.props.lobbyServiceUrl + '/v1/api/applicants/' + cell + '/state';
        }

        return `<a href='${url}'>Link</a>`
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

    additionalInfoOriginalIdFormatter(cell) {
        if (cell !== undefined && cell.originalRecordId !== undefined) {
            return cell.originalRecordId;
        } else {
            return '';
        }
    }

    additionalInfoNameFormatter(cell) {
        if (cell !== undefined && cell.name !== undefined) {
            return cell.name;
        } else {
            return '';
        }
    }

    additionalInfoAddressFormatter(cell) {
        if (cell !== undefined && cell.address !== undefined) {
            return cell.address;
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
    }

    render() {
        return (
            <div>
                <p>Filter: Kategori = <b>{this.props.category === '' ? 'Alle' : this.props.category}</b> | Status
                    = <b>{this.props.applicantState}</b> | Antal poster: <b>{this.props.applicants.length}</b></p>
                <BootstrapTable data={this.props.applicants}
                                striped={true}
                                options={{noDataText: 'Indlæser...'}}
                                bodyStyle={{overflow: 'overlay'}}>
                    <TableHeaderColumn dataField='id'
                                       isKey
                                       dataSort
                                       width='100'>Id</TableHeaderColumn>
                    {this.props.category === '' ? // Hide category if a category is specified
                        <TableHeaderColumn dataField='category'
                                           width='100'>Kategori</TableHeaderColumn> : null}
                    <TableHeaderColumn dataField='state'
                                       width='90'>Status</TableHeaderColumn>
                    <TableHeaderColumn dataField='timeOfLastModification'
                                       dataSort
                                       dataFormat={this.dateFormatter}
                                       width='160'>Ajour</TableHeaderColumn>

                    {this.props.category === 'dpf' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoTitleIdFormatter}
                                           width='300'
                                           tdStyle={{whiteSpace: 'normal'}}>Titel</TableHeaderColumn> : null}
                    {this.props.category === 'dpf' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoOriginalIdFormatter}
                                           width='150'>Original Id</TableHeaderColumn> : null}
                    {this.props.category === 'dpf' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoErrorsFormatter}
                                           tdStyle={{whiteSpace: 'normal'}}>Fejl</TableHeaderColumn> : null}

                    {this.props.category === 'forlag' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoNameFormatter}
                                           tdStyle={{whiteSpace: 'normal'}}>Navn</TableHeaderColumn> : null}
                    {this.props.category === 'forlag' ?
                        <TableHeaderColumn dataField='additionalInfo'
                                           dataFormat={this.additionalInfoAddressFormatter}
                                           tdStyle={{whiteSpace: 'normal'}}>Adresse</TableHeaderColumn> : null}

                    <TableHeaderColumn dataField='id'
                                       dataFormat={this.linkFormatterBody}
                                       width='75'>Post</TableHeaderColumn>
                    {this.props.dbckatMode ?
                        <TableHeaderColumn dataField='id'
                                           dataFormat={this.linkFormatterDelete}
                                           width='75'>Slet</TableHeaderColumn> : null}
                </BootstrapTable>
            </div>
        )
    }

}

export default ApplicantsList;
