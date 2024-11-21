import { createRoot } from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/all.css';

import 'bulma/css/bulma.css';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(<App />);
