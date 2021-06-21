import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter, Router} from 'react-router-dom';

import MainContainer from './components/MainContainer.jsx';

import './styles.scss'

const container = document.querySelector('#app');


ReactDom.render(
  <BrowserRouter>
    <MainContainer />
  </BrowserRouter>
  , container);