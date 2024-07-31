import * as React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.js';
import { HashRouter as Router } from 'react-router-dom';
import './index.scss';

const root = createRoot(document.getElementById('root'));
root.render(
<Router>
<App />
</Router>);