import React from 'react';
import Searchresult from './Searchresult';
import { useLocation } from 'react-router-dom';
import Header from '../display/Header';

const Searchresultpage = (props) => {
    const { state } = useLocation();

    return (
        <>
        <Header />
        <div>
            <Searchresult content={state} />
        </div>
        </>
    )
}

export default Searchresultpage;