import * as React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.js';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';

const root = createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
<App />
</BrowserRouter>);