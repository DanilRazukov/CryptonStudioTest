import React from 'react'

import axios from 'axios';

import CharacterCard from '../Base/CharacterCard.jsx';
import Pagination from '../Base/Pagination.jsx';
import Header from '../Base/Header.jsx';

export default class FavoritesPage extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      data: [],
      renderData: [],
      pagination: 1,
      allCount: 0,
      count: 0,
    }
  }

  async componentDidMount()
  {
    const favorites = await axios.get('http://localhost:3001/Favorites/')



    if (favorites.data.length)
    {
      this.state.data = favorites.data
    }

    this.state.count = this.state.data.length

    this.state.renderData = this.processingData(favorites.data);

    this.forceUpdate();
  }

  processingData = (data) =>
  {
    const curData = [];

    curData.push({
      Component: Header,
      data: {
        header: "My favorite characters"
      }
    })

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

      const count = this.state.count;

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

  likeClick = async (data) => 
  {
    const id = data.id;

    await axios.delete(`http://localhost:3001/Favorites/${ id }`);
    const index = this.state.data.findIndex(item => item.id == id);
    this.state.data.splice(index, 1);

    this.state.count = this.state.data.length;

    let dataArr = this.state.data.slice((this.state.pagination - 1) * 10, this.state.pagination * 10)

    if (!dataArr.length)
    {
      dataArr = this.state.data.slice((this.state.pagination - 2) * 10, (this.state.pagination - 1) * 10)
      --this.state.pagination
    }

    this.state.renderData = this.processingData(dataArr)
    this.forceUpdate();
  }

  changePagination = (num) =>
  {
    const {
      data,
    } = this.state;


    const dataArr = data.slice((num - 1) * 10, num * 10)

    this.state.pagination = num;

    this.state.renderData = this.processingData(dataArr)

    this.forceUpdate();
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