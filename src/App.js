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
    <footer className="footer app-footer">
      <div className="container footer-container">
        <p className="text-muted">Copyright © {new Date().getFullYear()} EBRAINS. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default App;