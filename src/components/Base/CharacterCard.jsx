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
      classButton,
      classImg,
      index
    } = this.props

    return (
      <div className={classCard}>
        <img src={data.src} className={classImg} />
        <div className={className}>
          Name: {data.name}
        </div>
        <div className={classHome}>
          Home World: {data.homeWorld}
        </div>
        <button className={classButton + (data.favorite ? " like" : "")} onClick={(ev) =>
        {
          this.props.onClick(data.id, index)
        }} />
      </div>
    )
  }
}