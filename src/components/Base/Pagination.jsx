import React from 'react'

export default class Pagination extends React.Component
{
  render()
  {
    const {
      classPagination,
      data
    } = this.props



    return (
      <div className={classPagination}>
        {
          data.map((item, index) =>
            <button
              key={index}
              className={item.classPag}
              onClick={(ev) =>
              {
                ev.stopPropagation();
                this.props.onClick(data.index)
              }}
            >{item.index}</button>)
        }
      </div>
    )
  }
}