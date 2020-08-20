import React from 'react';
import ReactDOM from 'react-dom';

import {App} from './components';

import './common/styles/Main.scss';

const Application = () => <App />;

ReactDOM.render(<Application />, document.getElementById('app'));