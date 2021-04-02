import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  // Set initial state
  // Currently ugly and not decoded
  // Could wire up Router if we want to rely on query params or have multiple windows
  const [data, setData] = useState(global.location.search);

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Python Data from URL Param:</h2>
          { data }
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
  );
}

export default App;
