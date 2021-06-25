import React from 'react'

import API from "../API"

import * as constants from '../constants'

import CharacterCard from '../Base/CharacterCard.jsx';
import Pagination from '../Base/Pagination.jsx';
import Header from '../Base/Header.jsx';
import Message from '../Base/Message.jsx'

export default class FavoritesPage extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      favorites: [],
      renderData: [],
      pagination: 1,
      view: constants.view.loader,
    }
  }

  forceUpdateSync = async () =>
  {
    await new Promise((resolve, reject) =>
    {
      this.forceUpdate(() => {resolve()});
    });
  }

  setViewMode = (mode) =>
  {
    this.state.view = mode;
    this.forceUpdate();
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

    this.state.renderData = this.processingData(favorites);

    this.setViewMode(constants.view.content);
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
      for (let i = 0; i < data.length; i++)
      {

        const elem = data[i];
        const id = elem.id;

        const item = {
          ...elem,
          favorite: 1,
          src: `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`
        }

        curData.push({
          data: item,
          Component: CharacterCard,
          classCard: "card",
          className: "person-name",
          classHome: "planet-name",
          classButton: "like-button",
          classImg: "person-ava",
          onClick: this.handleLikeClick
        })

        if (i == constants.numberOfCharacters - 1) break
      }

      const count = this.state.favorites.length;

      const countPagin = Math.ceil(count / constants.numberOfCharacters);

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
    else
    {
      curData.push({
        Component: Message,
        data: {
          message: "Now you have not favorite heroes"
        }
      })
    }
    return curData
  }

  handleLikeClick =  async (id) => 
  {
    const {
      pagination
    } = this.state;

    const index = this.state.favorites.findIndex(item => item.id == id);

    this.state.favorites.splice(index, 1);


    localStorage.setItem("Favorites", JSON.stringify(this.state.favorites));

    if (Math.ceil(this.state.favorites.length / constants.numberOfCharacters) < pagination) this.state.pagination--

    this.changePagination(this.state.pagination, 1)
  }

  changePagination = async (num, isLike) =>
  {
    if (!isLike)
    {
      this.state.view = constants.view.loader;
      await this.forceUpdateSync();
    }

    const firstPart = (num - 1) * constants.numberOfCharacters;
    const secondPart = num * constants.numberOfCharacters;

    const part = this.state.favorites.slice(firstPart, secondPart);
    this.state.pagination = num;
    this.state.renderData = this.processingData(part);
    this.setViewMode(constants.view.content);
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
                  index={index}
                  data={item.data}
                  onClick={item.onClick}
                  classButton={item.classButton}
                  classCard={item.classCard}
                  classHome={item.classHome}
                  className={item.className}
                  classImg={item.classImg}
                  classPagination={item.classPagination}
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