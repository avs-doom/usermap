'use strict';

const initialState = {
    users: [],
    activeUser: null
};

const ADD_USERS = 'ADD_USERS';
const SET_ACTIVE_USER = 'SET_ACTIVE_USER';

export default function users(state = initialState, action) {
    
    const { type } = action;
    
    switch(type) {
        case ADD_USERS:
            const { users } = action;
            return {...state, users};
        case SET_ACTIVE_USER:
            const { activeUser } = action;
            return {...state, activeUser};
        default:
            return state;
    }
}

export function addUsers(users) {
    return { type: ADD_USERS,  users};
}

export function setActiveUser(activeUser) {
    return { type: SET_ACTIVE_USER,  activeUser};
}