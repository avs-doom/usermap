'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserComponent from './User';


@connect(
    state => ({
        users: state.users
    })
)

export default class UsersComponent extends Component {
    
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
    
    _setState(props) {
        
        return {
            users: props.users
        };
    }
    
    _handlerUserClick() {
        
        window.console.log('test');
    }
    
    render() {
        
        const { users } = this.state;
        
        return (
            <aside className="users">
                {users.map((user, index) => <UserComponent user={user} key={index} />)}
            </aside>
        );
    }
}