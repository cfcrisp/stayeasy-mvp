import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AddClient from './pages/AddClient';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={SignUp} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/add-client" component={AddClient} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;