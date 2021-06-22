import React from 'react'
import API from '../../../API';
import axios from 'axios';

import MainContainer from '../MainContainer.jsx';

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
      countPage: 0,
      numberPage: 1,
      count: 0,
      searchData: [],
      allCount: 0,
      inputValue: "",
      favorites: [],
      lastUrl: "https://swapi.dev/api/people/"
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


  async componentDidMount()
  {
    const dataArr = [];

    let count

    if (!MainContainer.this.state.data.length)
    {
      const url = "https://swapi.dev/api/people"
      const response = await this.getData(url);

      if (!response)
      {
        this.state.view = constants.view.none;
        this.forceUpdate();
        return
      }

      count = response.data.count;

      this.state.allCount = count;

      this.state.count = count;

      const countPagin = Math.ceil(count / 10)

      for (let i = 1; i <= countPagin; i++)
      {
        if (i == 1)
        {
          for (let i = 0; i < response.data.results.length; i++)
          {
            const planet = await this.getData(response.data.results[i].homeworld);

            if (!planet)
            {
              this.state.view = constants.view.none;
              this.forceUpdate();
              return
            }

            response.data.results[i].planetName = planet.data.name;
          }
          response.data.results.forEach((item, index) =>
          {
            item.id = index + 1;
            dataArr.push({
              ...item
            })
          })
        }
        else
        {
          const url = "https://swapi.dev/api/people/?page=" + i
          const newResp = await this.getData(url);

          if (!newResp)
          {
            this.state.view = constants.view.none;
            this.forceUpdate();
            return
          }
          for (let i = 0; i < newResp.data.results.length; i++)
          {
            const planet = await this.getData(newResp.data.results[i].homeworld);

            newResp.data.results[i].planetName = planet.data.name;
          }
          newResp.data.results.forEach((item, index) =>
          {
            item.id = (i - 1) * 10 + index + 1;
            dataArr.push({...item})
          })
        }
      }

      MainContainer.this.saveData(dataArr)

    }
    else
    {
      MainContainer.this.state.data.forEach(item =>
      {
        dataArr.push({
          ...item
        })
      })

      this.state.allCount = count;

      this.state.count = count;
    }

    this.state.data = dataArr;

    const slicePage = {};

    const favorites = await axios.get('http://localhost:3001/Favorites/')
    .catch(error => {
      
      this.state.view = constants.view.none;
      this.forceUpdate();
      return
    })
    
    if (!favorites?.data)
    {
      this.state.view = constants.view.none;
      this.forceUpdate();
      return
    }

    if (favorites.data.length)
    {
      this.state.favorites = favorites.data
    }

    slicePage.results = dataArr.slice(0, 10);
    slicePage.count = count;

    this.state.renderData = this.processingData(slicePage);

    this.state.view = constants.view.content;

    this.forceUpdate();
  }

  componentWillUnmount()

  getData = async (url) =>
  {

    const data = await API.get(url);

    return data
  }

  processingData = (data) => 
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
      data.results.forEach(item =>
      {

        const id = item.id

        const newData = {
          name: item.name,
          homewWorld: item.planetName,
          src: `https://starwars-visualguide.com/assets/img/characters/${ id }.jpg`,
          id
        }
        let classButton = "like-button";
        this.state.favorites.forEach(elem =>
        {
          if (elem.id == item.id)
          {

            classButton += " like"
            item.favorite = 1;
          }
        })
        curData.push({
          Component: CharacterCard,
          classCard: "card",
          className: "person-name",
          classHome: "planet-name",
          classButton,
          classImg: "person-ava",
          data: newData,
          onClick: this.likeCard
        })
      })
    }

    const count = data.count

    const countPagin = Math.ceil(count / 10)

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
    return curData
  }


  likeCard = async (data) =>
  {
    const id = data.id;

    const curObj = {};
    let item;
    let favorite;
    let num;
    let index;

    if (!this.state.searchData.length)
    {
      index = this.state.data.findIndex(item => item.id == id)

      favorite = this.state.data[index].favorite;
      item = this.state.data[index];

      this.state.data[index].favorite = !favorite

      num = this.state.pagination;
      curObj.results = this.state.data.slice((num - 1) * 10, num * 10);
      curObj.count = this.state.count;
      item = this.state.data[index];
    }
    else
    {
      index = this.state.searchData.findIndex(item => item.id == id)

      favorite = this.state.searchData[index].favorite;
      item = this.state.searchData[index];

      this.state.searchData[index].favorite = !favorite

      num = this.state.pagination;
      curObj.results = this.state.searchData.slice((num - 1) * 10, num * 10);
      curObj.count = this.state.count;
      item = this.state.searchData[index];
    }

    if (!favorite)
    {
      await axios.post('http://localhost:3001/Favorites/', {
        "name": item.name,
        "id": item.id,
        "homeWorld": item.homeworld,
      })
      .catch(error => {
        this.state.view = constants.view.none;
        this.forceUpdate();
        return
      })

      this.state.favorites.push({...item})
    }
    if (favorite)
    {
      await axios.delete(`http://localhost:3001/Favorites/${ item.id }`)
      .catch(error => {
        this.state.view = constants.view.none;
        this.forceUpdate();
        return
      })
      const index = this.state.favorites.findIndex(elem => elem.id == item.id)
      this.state.favorites.splice(index, 1)
    }


    this.state.renderData = this.processingData(curObj)

    this.forceUpdate();

  }

  changePagination = async (num) =>
  {
    const {
      data,
      searchData
    } = this.state;

    const slicePage = {};
    if (searchData.length)
    {
      slicePage.results = searchData.slice((num - 1) * 10, num * 10)
    }
    else
    {
      slicePage.results = data.slice((num - 1) * 10, num * 10)
    }

    slicePage.count = this.state.count

    this.state.pagination = num;

    this.state.renderData = this.processingData(slicePage)

    this.forceUpdate();
  }

  onChangeInput = (value) => 
  {
    const {
      data
    } = this.state
    this.state.inputValue = value;

    this.forceUpdate();

    this.setDelay(async () =>
    {
      this.state.pagination = 1;

      const searchArr = []

      const processObj = {}



      if (value)
      {
        data.forEach(item =>
        {
          if (item.name.indexOf(value) > 0)
          {
            searchArr.push({
              ...item
            })
          }
        })

        this.state.count = searchArr.length;

        processObj.results = searchArr.slice(0, 10);

        processObj.count = searchArr.length;
      }
      else
      {
        this.state.count = data.length;
        processObj.results = data.slice(0, 10);
        processObj.count = data.length
      }

      this.state.searchData = searchArr



      this.state.renderData = this.processingData(processObj)

      await this.forceUpdateSync();
    }, 500, constants.delayIndex.search)
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