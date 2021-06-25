import React from 'react'
import API from '../API';

import CharacterCard from '../Base/CharacterCard.jsx';
import Input from '../Base/Input.jsx';
import Pagination from '../Base/Pagination.jsx';
import Header from '../Base/Header.jsx';

import * as constants from "../constants"

let delay = 0
export default class MainPage extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      view: constants.view.loader,
      data: [],
      renderData: [],
      pagination: 1,
      inputValue: "",
      favorites: [],
      searchUrl: "",
      count: 0,
    }

  }

  setDelay = (f, t) =>
  {
    clearTimeout(delay);
    delay = setTimeout(f, t);
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


  async componentDidMount()
  {
    const url = constants.url + "?page=1"
    const response = await this.getData(url);

    if (!response)
    {
      this.setViewMode(constants.view.none);
      return
    }

    const favorites = JSON.parse(localStorage.getItem("Favorites")) || [];

    response.data.results.forEach(item =>
    {
      const strData = item.url.split("/");
      item.id = strData[strData.length - 2];
      item.favorite = favorites.some(elem => elem.id == item.id);
    })

    this.state.favorites = favorites || [];

    this.state.data = response.data.results;
    this.state.count = response.data.count;
    this.state.renderData = await this.processingData(response.data);


    this.setViewMode(constants.view.content);
  }

  getData = async (url) =>
  {
    const data = await API.get(url);

    return data
  }

  processingData = async (data) => 
  {

    const curData = [];

    curData.push({
      Component: Header,
      data: {
        header: "All characters"
      }
    })

    if ("results" in data)
    {
      for (let i = 0; i < data.results.length; i++)
      {
        const item = data.results[i];

        const response = await this.getData(item.homeworld);

        item.homePlanet = response.data.name;

        const newData = {
          name: item.name,
          homeWorld: item.homePlanet,
          src: `https://starwars-visualguide.com/assets/img/characters/${item.id}.jpg`,
          id: item.id,
          favorite: item.favorite
        };

        const classButton = "like-button" + (item.favorite ? " like" : "");

        curData.push({
          Component: CharacterCard,
          classCard: "card",
          className: "person-name",
          classHome: "planet-name",
          classButton,
          classImg: "person-ava",
          data: newData,
          onClick: this.handleLikeClick
        });
      }
    }

    const countPagin = Math.ceil(data.count / 10);

    const arrPag = [];

    for (let i = 0; i < countPagin; i++)
    {
      arrPag.push({
        index: i + 1,
        classPag: ("number" + ((this.state.pagination == i + 1) ? " active" : " "))
      });
    }

    curData.push({
      Component: Pagination,
      data: arrPag,
      classPagination: "pagination-line",
      onClick: this.changePagination
    });
    return curData
  }


  handleLikeClick = async (data) =>
  {
    const {
      count,
    } = this.state

    const likeArr = this.state.favorites;

    data.favorite = !data.favorite;

    let index = likeArr.findIndex(item => item.id == data.id);

    index >= 0 ? likeArr.splice(index, 1) : likeArr.push({
      id: data.id
    });

    index = this.state.data.findIndex(item => item.id == data.id);

    if (index >= 0) this.state.data[index].favorite = data.favorite;

    localStorage.setItem("Favorites", JSON.stringify(likeArr));

    this.state.favorites = likeArr;

    this.state.renderData = await this.processingData({
      results: this.state.data,
      count: count
    });

    this.forceUpdate();
  }

  changePagination = async (num) =>
  {
    const {
      searchUrl,
      favorites
    } = this.state;

    this.state.view = constants.view.loader;

    await this.forceUpdateSync();

    const url = searchUrl ? (searchUrl + "&page=" + num) : (constants.url + "?page=" + num)

    const response = await this.getData(url)

    if (!response)
    {
      this.setViewMode(constants.view.none);
      return
    }

    this.state.pagination = num;

    response.data.results.forEach(item =>
    {
      const strData = item.url.split("/");
      item.id = strData[strData.length - 2];
      item.favorite = favorites.some(elem => elem.id == item.id);
    })

    this.state.data = response.data.results;
    this.state.count = response.data.count;
    this.state.renderData = await this.processingData(response.data);

    this.setViewMode(constants.view.content);
  }

  onChangeInput = (value) => 
  {
    const {
      data
    } = this.state
    this.state.inputValue = value;

    this.forceUpdate();

    if (!value)
    {
      this.state.searchUrl = ""
    }


    this.setDelay(async () =>
    {
      this.state.pagination = 1;

      await this.search(value)
    }, 500, constants.delayIndex.search)
  }

  search = async (value) =>
  {
    const {
      favorites
    } = this.state;

    this.state.view = constants.view.loader;

    await this.forceUpdateSync();

    const url = constants.url + "?search=" + value;

    this.state.searchUrl = url;

    const response = await this.getData(url);

    if (!response)
    {
      this.setViewMode(constants.view.none);

      return
    }

    response.data.results.forEach(item =>
    {
      const strData = item.url.split("/");
      item.id = strData[strData.length - 2];
      item.favorite = favorites.some(elem => elem.id == item.id);
    })

    this.state.data = response.data.results;

    this.state.count = response.data.count;
    this.state.renderData = await this.processingData(response.data);

    this.setViewMode(constants.view.content);
  }



  render()
  {
    const {
      renderData,
      inputValue,
      view
    } = this.state;



    return (
      <div className="main">
        {
          view == constants.view.content ?
            <>
              <div className="input">
                <Input
                  value={inputValue}
                  onChange={this.onChangeInput}
                />
              </div>
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
                />)}
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