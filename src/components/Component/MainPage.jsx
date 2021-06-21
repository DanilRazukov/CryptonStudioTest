import React from 'react'
import API from '../../../API';
import CharacterCard from '../Base/CharacterCard.jsx';
import Input from '../Base/Input.jsx';
import Pagination from '../Base/Pagination.jsx';
import * as constants from "../constants"

let delay = 0
export default class MainPage extends React.Component
{


  constructor(props)
  {
    super(props);
    this.state = {
      data: [],
      renderData: [],
      pagination: 1,
      countPage: 0,
      numberPage: 1,
      count: 0,
      searchData: [],
      allCount: 0,
      inputValue: "",
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
    const url = "https://swapi.dev/api/people"
    const response = await this.getData(url);


    const count = response.data.count;

    this.state.allCount = count;

    this.state.count = count;

    const countPagin = Math.ceil(count / 10)

    const dataArr = [];

    for (let i = 1; i <= countPagin; i++)
    {
      if (i == 1)
      {
        response.data.results.forEach(item =>
        {
          dataArr.push({
            ...item
          })
        })
      }
      else
      {
        const url = "https://swapi.dev/api/people/?page=" + i
        const newResp = await this.getData(url);
        newResp.data.results.forEach(item =>
        {
          dataArr.push({...item})
        })
      }
    }



    this.state.data = dataArr;

    const slicePage = {}

    slicePage.results = dataArr.slice(0, 10)
    slicePage.count = count

    this.state.renderData = await this.processingData(slicePage);

    this.forceUpdate();
  }

  getData = async (url) =>
  {

    const data = await API.get(url);

    return data
  }

  processingData = async (data) => 
  {

    const curData = [];

    if ("results" in data)
    {
      for (let i = 0; i < data.results.length; i++)
      {
        const planet = await this.getData(data.results[i].homeworld);

        data.results[i].planetName = planet.data.name;
      }

      data.results.forEach(item =>
      {
        const arr = item.url.split("/"); ////?????

        const id = arr[arr.length - 2]
        console.log(id)
        const newData = {
          name: item.name,
          homewWorld: item.planetName,
          src: `https://starwars-visualguide.com/assets/img/characters/${ id }.jpg`,
          id
        }
        const classButton = "like-button"
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


  likeCard = (data) =>
  {
    return

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

    this.state.renderData = await this.processingData(slicePage)

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



      this.state.renderData = await this.processingData(processObj)

      await this.forceUpdateSync();
    }, 500, constants.delayIndex.search)
  }



  render()
  {
    const {
      renderData,
      inputValue,
    } = this.state;



    return (
      <div className="main">
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
            onClick={item.onClick}
          />)}
      </div>
    )
  }
}