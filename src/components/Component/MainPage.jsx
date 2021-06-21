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
      inputValue: "",
      lastUrl: "https://swapi.dev/api/people/?page%3A1=&"
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
    const url = "https://swapi.dev/api/people/?page%3A1=&page=1"
    const response = await this.getData(url);

    this.state.renderData = await this.processingData(response.data);

    this.state.data = response;

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

    debugger

    if ("results" in data)
    {
      for (let i = 0; i < data.results.length; i++)
      {
        if (data.results[i].planetName) return
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

    const count = data.count;

    this.state.countPage = count;

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
    const url = this.state.lastUrl + `&page=${ num }`;

    this.state.pagination = num;

    const response = await this.getData(url);

    this.state.data = response;
    this.state.renderData = await this.processingData(response.data);
    this.forceUpdate();
  }

  onChangeInput = (value) => 
  {
    this.state.inputValue = value;

    this.forceUpdate();
    let url = "";

    let isDischarge = false;

    if (!value)
    {
      url = "https://swapi.dev/api/people/?page%3A1=&page=1"
      isDischarge = true;
    }
    else
    {
      url = `https://swapi.dev/api/people/?search%3A1=&search=${ value }`
    }

    this.setDelay(async () =>
    {
      this.state.pagination = 1;
      const response = await this.getData(url);
      this.state.renderData = await this.processingData(response.data);
      if (isDischarge) url = "https://swapi.dev/api/people/?page%3A1="
      this.state.lastUrl = url;
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