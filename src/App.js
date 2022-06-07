import logo from './logo.svg';
import './App.css';
import {React, useState} from 'react';
import Canvas from './compoenents/canvas'

import {api} from './services/api.js';

function App() {
  const [predict, setPredict] = useState(null);

  const clearCanvas = () => {
      const canvas = document.getElementById(
          'canvas',
      );
      canvas.width += 0;
  };

  
  async function predictImage(blob){
    const data = new FormData();
    data.append('file', blob, 'file');

    const response = await api.post('predict', data, {
        headers: {'content-type': 'multipart/form-data'},
    });

    const predict = response.data;

    setPredict(predict);
}

  
  return (
    <div className="App">
      <header className="App-header">
        <p>{predict}</p>
               <Canvas width={500} height={500} predictImage={predictImage} />

               <button onClick={clearCanvas}>
                  Limpar
               </button>
      </header>
    </div>
  );
}

export default App;
