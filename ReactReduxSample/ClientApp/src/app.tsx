import * as React from 'react';
import { Route } from 'react-router';
import Layout from './common/Layout';
import Home from './home/Home';
import DoseManagement from './doseManagement/doseManagement';

import './custom.scss';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/dosemanagement' component={DoseManagement} />
     </Layout>
);
