import React from 'react'
import {NavLink} from 'react-router-dom';

export default class NavBar extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {

    }
  }

  render() 
  {
    return (
      <div className="nav">
        <NavLink to="/">Main Page</NavLink>
        <NavLink to="/favorites">Favorite characters</NavLink>
      </div>
    )
  }
}