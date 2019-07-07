import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Login from './pages/login/index'
import Admin from './pages/background/admin/index'
/**
 * 应用根组件
 * @returns {*}
 * @constructor
 */
function App() {
  return (
    <BrowserRouter>
        {/*只匹配其中一个，匹配到了就显示*/}
        <Switch>
            <Route path='/login' component={Login}/>
            <Route path='/' component={Admin}/>
        </Switch>
    </BrowserRouter>
  );
}

export default App;
