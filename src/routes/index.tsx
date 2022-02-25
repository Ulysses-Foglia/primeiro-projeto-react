import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => (
    <Switch>
        <Route path='/' exact component={Dashboard} />
        <Route path='/repository/:repository+' component={Repository} />
    </Switch>
);
/* o + está indicando que tudo que vem depois de repository az parte dele, e não de uma outra rota
Ex.: /Facebook/React */
export default Routes;