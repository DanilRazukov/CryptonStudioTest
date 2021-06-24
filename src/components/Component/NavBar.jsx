import React from 'react'
import {NavLink} from 'react-router-dom';

export default class NavBar extends React.Component
{
  render() 
  {
    return (
      <div className="nav">
        <NavLink exact to="/" activeStyle={{backgroundColor: "#35D3A7"}}>Main Page</NavLink>
        <NavLink to="/favorites" activeStyle={{backgroundColor: "#35D3A7"}}>Favorite characters</NavLink>
      </div>
    )
  }
}