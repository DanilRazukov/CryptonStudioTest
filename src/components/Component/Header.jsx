import React from 'react'

export default class Header extends React.Component
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
      <img className="header" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Star_wars2.svg/1200px-Star_wars2.svg.png" />
    )
  }
}