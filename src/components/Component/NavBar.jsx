import React from 'react'

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
        <a className="main-page" href="#" onClick={(ev) => {ev.preventDefault(); return }}>
          Main Page
        </a>
        <a className="favorites-page" href="#" onClick={(ev) => {ev.preventDefault(); return }}>
          Favorite characters
        </a>
      </div>
    )
  }
}