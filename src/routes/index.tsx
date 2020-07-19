import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => (
  // usamos parenteses para fechar function pq ai retorno feito automatico
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/informacao/:codigo+" component={Repository} />
  </Switch>
);

export default Routes;

// <> //fragment
// </>
