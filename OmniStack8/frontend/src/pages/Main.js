import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import logo from  '../assets/logo.svg';
import like from  '../assets/like.svg';
import deslike from  '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';

import './Main.css';
import api from '../services/api';

export default function Main({ match }){
    const [users, setUsers]  = useState([]);
    const [matchDev, setMatchDev] = useState();

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                }
            })

            setUsers(response.data);
        }

        loadUsers();

    } , [match.params.id]); //match.params.id pega o id do usuario logado

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        }); //conectar com o backend

        socket.on('match', dev =>{
            setMatchDev(dev) //passa as informações do dev para o objeto MatchDev
        })
    }, [match.params.id]); 

    async function handleLike(id){
        await api.post(`/devs/${id}/likes`, null, {
            headers: {  user: match.params.id },
        })
    }

    async function handleDislike(id){
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id },
        })

        setUsers(users.filter(user => user._id !== id ));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
                { users.length > 0 ? (
                    <ul> 
                        {users.map(user => (
                    <li key={user._id}>
                    <img src={user.avatar} alt= {user.name} />
                    <footer>
                        <strong>{user.name}</strong>
                        <p>{user.bio}</p>
                    </footer>

                    <div className="buttons">
                        <button type="button" onClick={() => handleDislike(user._id)}>
                            <img src={deslike} alt="Dislike" />
                        </button>
                        <button type="button" onClick={() => handleLike(user._id)}>
                            <img src={like} alt="Like" />
                        </button>
                    </div>
                </li>
                ))}
                    </ul>
                ): (
                    <div className="empty"> Acabou :( </div>
                )}

                { matchDev && (
                    <div className='match-container'>
                        <img src={itsamatch} alt="It's a match" />
                        <img className="avatar" src={matchDev.avatar} alt=""/>
                        <strong>{matchDev.name}</strong>
                        <p>{matchDev.bio}</p>
                        
                        <button type='button' onClick={ () => setMatchDev(null)} > Fechar </button>
                    </div>
                )}
        </div>
    );
}