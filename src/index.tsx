import { createRoot } from 'react-dom/client';
import React from 'react';

import 'bulma/css/bulma.css';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(<App />);
