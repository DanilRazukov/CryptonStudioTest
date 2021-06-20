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
      classImg
    } = this.props



    return (
      <div className={classCard}>
        <img src={data.src} className={classImg} />
        <div className={className}>
          Name: {data.name}
        </div>
        <div className={classHome}>
          Home World: {data.homewWorld}
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