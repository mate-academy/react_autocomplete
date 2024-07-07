import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import { App } from './App';
import * as React from 'react';

createRoot(document.getElementById('root') as HTMLDivElement).render(<App />);
