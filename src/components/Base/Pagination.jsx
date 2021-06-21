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
            <div key={index} className="pagination">
              <button
                className={item.classPag}
                onClick={(ev) =>
                {
                  ev.stopPropagation();
                  this.props.onClick(item.index)
                }}
              >
                <div className="num">
                  {item.index}
                </div>
              </button>
            </div>
          )
        }
      </div>
    )
  }
}