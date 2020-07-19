import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GlogalStyle from './styles/global';
import Routes from './routes';

const App: React.FC = () => (
  <>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
    <GlogalStyle />
  </>
);

export default App;
