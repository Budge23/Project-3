import React from 'react'
import { BrowserRouter, Switch, Route }  from 'react-router-dom'
import bulma from 'bulma'


import '../styles/style.scss'

import Home from './components/Home'
import NavBar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import PubList from './components/PubList'
import CreatePub from './components/CreatePub'
import Maps from './components/Maps'

const App = () => {
  return <>
  <BrowserRouter>
    <NavBar />
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/pubs' component={PubList} /> 
      <Route exact path='/pubs/maps' component={Maps}/>
      <Route exact path='/pubs/new-pub' component={CreatePub} />

    </Switch>
  </BrowserRouter>
  </>
}


export default App