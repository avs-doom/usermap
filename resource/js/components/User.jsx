'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setActiveUser } from '../_core/Store';


@connect(
    state => ({}),
    dispatch => ({
        onActiveUser: activeUser => dispatch(setActiveUser(activeUser))
    })
)

export default class UserComponent extends Component {
    
    static get propTypes() {
        return {
            user: PropTypes.object.isRequired
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
            user: props.user
        };
    }
    
    _handlerUserClick(events) {
        event && event.stopPropagation();
        
        const { onActiveUser } = this.props;
        const { user } = this.state;
        
        if (onActiveUser) {
            onActiveUser(user);
        }
    }
    
    render() {
        
        const { user: { properties } } = this.state;
        const { color, userName, email, avatar } = properties;
        
        return (
            <section className="user" style={{background: color}} onClick={this._handlerUserClick.bind(this)}>
                <div style={{display: 'inline-block', padding: '0 20px 0 0'}}>
                     <p><img src={avatar} title={userName} style={{width: '128px', height: '128px'}} /></p>
                 </div>
                 <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                     <p>{userName}</p>
                     <p>{email}</p>
                 </div>
             </section>
        );
    }
}