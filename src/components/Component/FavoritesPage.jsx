import React from 'react'

import axios from 'axios';

import CharacterCard from '../Base/CharacterCard.jsx';
import Pagination from '../Base/Pagination.jsx';

export default class FavoritesPage extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      data: [],
      renderData: []
    }
  }

  async componentDidMount()
  {
    const favorites = await axios.get('http://localhost:3001/Favorites/')

    debugger

    if (favorites.data.length)
    {
      this.state.data = favorites.data
    }

    this.state.renderData = this.processingData(favorites.data);

    this.forceUpdate();
  }

  processingData = (data) =>
  {
    const curData = [];

    if (data.length)
    {
      data.forEach(item =>
      {
        if (!item.id) return
        curData.push({
          data: {
            name: item.name,
            homewWorld: item.planetName,
            src: `https://starwars-visualguide.com/assets/img/characters/${ item.id }.jpg`,
            id: item.id
          },
          Component: CharacterCard,
          classCard: "card",
          className: "person-name",
          classHome: "planet-name",
          classButton: "like-button like",
          classImg: "person-ava",
          onClick: this.likeClick
        })
      })

      const count = data.length;

      const countPagin = Math.ceil(count / 10);

      const arrPag = [];

      for (let i = 0; i < countPagin; i++)
      {
        arrPag.push({
          index: i + 1,
          classPag: ("number" + ((this.state.pagination == i + 1) ? " active" : " "))
        })
      }

      curData.push({
        Component: Pagination,
        data: arrPag,
        classPagination: "pagination-line",
        onClick: this.changePagination
      })
    }

    return curData
  }

  likeClick = (id) => 
  {
    return
  }

  changePagination = (num) =>
  {
    return
  }

  render()
  {
    const {
      renderData
    } = this.state;

    return (
      <div className="favorites">
        {renderData.map((item, index) =>
          <item.Component
            key={index}
            data={item.data}
            onClick={item.onClick}
            classButton={item.classButton}
            classCard={item.classCard}
            classHome={item.classHome}
            className={item.className}
            classImg={item.classImg}
            classPagination={item.classPagination}
            classButton={item.classButton}
          />
        )}
      </div>
    )
  }
}