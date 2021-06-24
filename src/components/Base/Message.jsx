import React from 'react'

export default class Message extends React.Component
{
  render()
  {
    const {
      data
    } = this.props
    return (
      <div className="message">
        {data.message}
      </div>
    )
  }
}