import React, { useReducer, useEffect, useContext } from 'react';
import { AppContext } from './AppContext';
import { AuthContext } from './AuthContext';
import AppReducer from './appReducer';
import axios from 'axios'; 

const INITIAL_STATE = {
    watchlist: [],
    loading: false,
    error: null,
};


const API_BASE_URL = "/api/filmes";

export const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);
    
    const { isAuthenticated } = useContext(AuthContext); 

    
    const getFilmes = async () => {
        if (!isAuthenticated) return;

        dispatch({ type: 'LOADING_START' });
        try {
            
            const response = await axios.get(API_BASE_URL);

           
            dispatch({ type: 'SET_WATCHLIST', payload: response.data });

        } catch (error) {
            console.error("Erro ao carregar filmes:", error);
            const errorMessage = error.response?.data?.message || 'Erro ao buscar filmes no servidor.';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        } finally {
            dispatch({ type: 'LOADING_END' });
        }
    };

    const addFilmToWatchlist = async (movie) => {
        if (!isAuthenticated) {
            console.error('Você precisa estar logado para adicionar filmes.');
            dispatch({ type: 'SET_ERROR', payload: 'Você precisa estar logado para adicionar filmes.' });
            return;
        }

        dispatch({ type: 'LOADING_START' });
        try {
            
            const response = await axios.post(API_BASE_URL, {
                titulo: movie.titulo,
                data_lancamento: movie.data_lancamento,
                media_votos: movie.media_votos,
                resumo: movie.resumo,
                poster_path: movie.poster_path,
            });

            
            dispatch({ type: 'ADD_FILM_TO_WATCHLIST', payload: response.data });

        } catch (error) {
            console.error("Erro ao adicionar filme:", error);
            const errorMessage = error.response?.data?.message || 'Erro ao adicionar filme.';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        } finally {
            dispatch({ type: 'LOADING_END' });
        }
    };

   
    const removeFilmFromWatchlist = async (id) => {
        if (!isAuthenticated) {
            console.error('Você precisa estar logado para remover filmes.');
            dispatch({ type: 'SET_ERROR', payload: 'Você precisa estar logado para remover filmes.' });
            return;
        }

        dispatch({ type: 'LOADING_START' });
        try {
            
            await axios.delete(`${API_BASE_URL}/${id}`);

            
            dispatch({ type: 'REMOVE_FILM_FROM_WATCHLIST', payload: id });

        } catch (error) {
            console.error("Erro ao remover filme:", error);
            const errorMessage = error.response?.data?.message || 'Erro ao remover filme.';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        } finally {
            dispatch({ type: 'LOADING_END' });
        }
    };
    
   
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    
    useEffect(() => {
        if (isAuthenticated) {
            
            const timer = setTimeout(() => {
              getFilmes();
            }, 100);
            return () => clearTimeout(timer);
        } else {
            
            dispatch({ type: 'SET_WATCHLIST', payload: [] });
        }
    }, [isAuthenticated]); 

    return (
        <AppContext.Provider
            value={{
                watchlist: state.watchlist,
                loading: state.loading,
                error: state.error,
                addFilmToWatchlist,
                removeFilmFromWatchlist, 
                getFilmes,
                clearError,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};