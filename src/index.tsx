import ReactDOM from 'react-dom';
import { App } from './App';
import 'bulma/css/bulma.css';

ReactDOM.render(<App debounceDelay={1000} />, document.getElementById('root'));
