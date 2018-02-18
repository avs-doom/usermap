'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FakeService from '../services/FakeService'

import UsersComponent from '../components/Users';
import MapComponent from '../components/Map';

import { addUsers } from './Store';


class Application extends Component {
    
    static get propTypes() {
        return {
            users: PropTypes.array.isRequired
        }
    }
    
    constructor(props) {
        super(props);
        
        this.state = this._setState(props);
    }
    
    componentWillReceiveProps(nextProps) {

        this.setState(this._setState(nextProps));
    }
    
    componentDidMount() {
        
        this._getFeature();
    }
    
    _setState(props) {
        
        return {collection: props.users};
    }
    
    _getFeature() {
        
        FakeService.getFeatures()
        .then(data => this._updateUsers(data))
        .catch(error => this._errorProcces(error));
    }
    
    _updateUsers(data) {
    
        if ('features' in data) {
            
            const { onAddUsers } = this.props;
            
            if (onAddUsers) {
                
                const { features } = data;
                onAddUsers(features.splice(0, 20));
            }
        }
    }
    
    _errorProcces(error) {
            
        window.console.error(error);
    }
    
    render() {
        
        return (
            <section className="wrapper">
                <UsersComponent />
                <MapComponent />
            </section>
        );
    }
}

export default connect(
    state => ({
        users: state.users
    }),
    dispatch => ({
        onAddUsers: users => dispatch(addUsers(users))
    })
)(Application);