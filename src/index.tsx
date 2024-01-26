import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import { App } from './App';

const delay = 1500;

ReactDOM.render(<App delay={delay} />, document.getElementById('root'));
