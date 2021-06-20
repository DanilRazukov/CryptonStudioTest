import React from 'react'
import API from '../../API';

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
    debugger
    const url = "https://swapi.dev/api/people/?page:1"
    const response = await this.getData(url);

    this.state.renderData = this.processingData(response)
  }

  getData = async (url) =>
  {
    debugger
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
        data.results[i].planetName = planet.name;
      }

      data.results.forEach(item =>
      {

      })
    }

    return curData
  }





  render()
  {
    return (
      <>
        <div>
          Hello
        </div>
      </>
    )
  }
}