import React, { useReducer, useContext } from 'react';
import { AppContext } from './AppContext';
import { AuthContext } from './AuthContext';
import { appReducer, initialState } from './appReducer'; 
import axios from 'axios'; 



const API_BASE_URL = "/api/filmes";

export const AppProvider = (props) => {
    
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider
            value={{
                state, 
                dispatch, 
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};