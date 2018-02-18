'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import users from './_core/Store';

import Application from './_core/Application';


export class Main  {
    
    constructor() {
        
        const store = createStore(users);
        const target = document.getElementById('application');
        
        ReactDOM.render(
            <Provider store={store}>
                <Application />
            </Provider>
        , target);
    }
}

export default new Main();