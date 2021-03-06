import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import Play from './components/Play';
import Settings from './pages/Settings';
import Feedbacks from './pages/Feedbacks';
import Ranking from './pages/Ranking';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route exact path="/play" component={ Play } />
        <Route exact path="/settings" component={ Settings } />
        <Route exact path="/feedback" component={ Feedbacks } />
        <Route path="/ranking" component={ Ranking } />
      </Switch>
    );
  }
}

export default App;
