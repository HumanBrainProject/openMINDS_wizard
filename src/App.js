import MainForm from './components/MainForm';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src="openMINDS_logo.png" alt="openminds" height="100" />
      </header>
      <div className="form">
         <MainForm />
      </div>
    </div>
  );
}

export default App;
