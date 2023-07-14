import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import { App } from './App';

ReactDOM.render(<App debounceDelay={1000} />, document.getElementById('root'));
