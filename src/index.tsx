import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import { App } from './App';

const delay = 250;

ReactDOM.render(<App delay={delay} />, document.getElementById('root'));
