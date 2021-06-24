import React from 'react'

import API from "../API"

import * as constants from '../constants'

import CharacterCard from '../Base/CharacterCard.jsx';
import Pagination from '../Base/Pagination.jsx';
import Header from '../Base/Header.jsx';

export default class FavoritesPage extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      favorites: [],
      renderData: [],
      pagination: 1,
      count: 0,
      view: constants.view.loader,
    }
  }

  getData = async (url) =>
  {
    const data = await API.get(url);

    return data
  }

  async componentDidMount()
  {
    const favorites = JSON.parse(localStorage.getItem("Favorites")) || [];

    this.state.favorites = favorites;

    this.state.renderData = await this.processingData(favorites);

    this.state.view = constants.view.content;

    this.forceUpdate();
  }

  processingData = async (data) =>
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
      for (let i = 0; i < data.length; i++)
      {
        const id = data[i].id;

        const url = constants.url + id;

        const response = await this.getData(url);

        const homeWorld = await this.getData(response.data.homeworld);

        const item = {
          id,
          name: response.data.name,
          homeWorld: homeWorld.data.name,
          src: `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`
        }

        curData.push({
          data: item,
          Component: CharacterCard,
          classCard: "card",
          className: "person-name",
          classHome: "planet-name",
          classButton: "like-button like",
          classImg: "person-ava",
          onClick: this.likeClick
        })

        if (i == 9) break
      }

      const count = this.state.favorites.length;

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
    const {
      pagination
    } = this.state;
    const id = data.id;

    this.state.view = constants.view.loader;
    this.forceUpdate();

    const index = this.state.favorites.findIndex(item => item.id == id);

    this.state.favorites.splice(index, 1);

    localStorage.setItem("Favorites",JSON.stringify(this.state.favorites));

    const part = this.state.favorites.slice((pagination-1)*10, pagination * 10);
    this.state.renderData = await this.processingData(part);
    this.state.view = constants.view.content;
    this.forceUpdate();
  }

  changePagination = async (num) =>
  {
    this.state.view = constants.view.loader;
    await this.forceUpdate();

    const part = this.state.favorites.slice((num - 1) * 10, num * 10)
    this.state.pagination = num;
    this.state.renderData = await this.processingData(part);
    this.state.view = constants.view.content;
    this.forceUpdate();
  }

  render()
  {
    const {
      renderData,
      view
    } = this.state;

    return (
      <div className="favorites">
        {
          view == constants.view.content ?
            <>
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
            </>
            : view == constants.view.loader ?
              <div className="loader-ring-m">
                <div /><div /><div />
              </div>
              : null
        }
      </div>
    )
  }
}