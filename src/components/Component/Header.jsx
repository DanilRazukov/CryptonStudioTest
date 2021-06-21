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
      <img className="header" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Star_wars_1977_us.svg/1280px-Star_wars_1977_us.svg.png" />
    )
  }
}