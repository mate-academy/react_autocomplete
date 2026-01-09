import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import { App } from './components/App';

createRoot(document.getElementById('root') as HTMLDivElement).render(<App />);
