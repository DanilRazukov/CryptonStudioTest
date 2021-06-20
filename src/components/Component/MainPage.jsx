import React from 'react'
import API from '../../../API';
import CharacterCard from '../Base/CharacterCard.jsx';

export default class MainPage extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      data: [],
      renderData: [],
      pagination: 0,
      numberPage: 1,
    }
  }


  async componentDidMount()
  {
    const url = "https://swapi.dev/api/people/?page:1"
    const response = await this.getData(url);


    console.log(response)

    this.state.renderData = await this.processingData(response.data);

    console.log(this.state.renderData)

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

    if ("results" in data)
    {
      for (let i = 0; i < data.results.length; i++)
      {
        if (data.results[i].planetName) return
        const planet = await this.getData(data.results[i].homeworld);
        debugger
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
    return curData
  }


  likeCard = (data) =>
  {
    return
  }





  render()
  {
    const {
      renderData,
    } = this.state;


    return (
      <div className="main">
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
            classButton={item.classButton}
            onClick={item.onClick}
          />)}
      </div>
    )
  }
}