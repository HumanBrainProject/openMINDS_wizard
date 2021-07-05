import Wizard from './components/Wizard';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src="openMINDS_logo.png" alt="openminds" height="100" />
    </header>
    <div className="form">
      <Wizard />
    </div>
  </div>
);

export default App;