import React from 'react'

export default class Header extends React.Component
{
  render()
  {
    const {
      data
    } = this.props
    return (
      <div className="header-page">
        {data.header}
      </div>
    )
  }
}