import React from 'react';
import ReactDom from 'react-dom';
import MainContainer from './components/MainContainer.jsx';

const container = document.querySelector('#app');


ReactDom.render(
  <MainContainer />
  , container);