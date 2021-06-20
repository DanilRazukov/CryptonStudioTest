import React from 'react'
import MainPage from './Component/MainPage.jsx';
import NavBar from './Component/NavBar.jsx';
import Header from './Component/Header.jsx';
export default class MainContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {

    }
  }

  render()
  {
    return (
      <div className="app">
        <NavBar />
        <MainPage />
        <Header />
      </div>
    )
  }
}