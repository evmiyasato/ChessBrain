import './App.scss';
import Chessboard from './components/Chessboard/Chessboard.js';
import CreateMove from './components/CreateMove/CreateMove.js';

function App() {
  return (
    <div className="App">
      <div className="boardComponentContainer">
        < Chessboard />
      </div>
    </div>
  );
}

{/* < CreateMove /> */}

export default App;
