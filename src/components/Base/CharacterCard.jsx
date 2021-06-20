import React from 'react'

export default class CharacterCard extends React.Component
{

  render()
  {
    const {
      data,
      className,
      classCard,
      classHome,
      classButton
    } = this.props
    return (
      <div className={classCard}>
        <img src={data.src} />
        <div className={className}>
          {data.name}
        </div>
        <div className={classHome}>
          {data.homeWorld}
        </div>
        <button className={classButton} onClick={(ev) =>
        {
          ev.preventDefault;
          ev.stopPropagation;
          this.props.onClick(data)
        }} />
      </div>
    )
  }
}