import React from 'react'
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';

import MainPage from './Component/MainPage.jsx';
import NavBar from './Component/NavBar.jsx';
import Cap from './Component/Cap.jsx';
import FavoritesPage from './Component/FavoritesPage.jsx'


export default class MainContainer extends React.Component
{
  render()
  {
    return (
      <div className="app">
        <NavBar />
        <div className="page">
          <Route exact path="/" component={MainPage} />
          <Route path="/favorites" component={FavoritesPage} />
        </div>
        <Cap />
      </div>
    )
  }
}