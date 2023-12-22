import './App.scss';
import { AutoComplete } from './Components/AutoComplete';

export const App = () => {
  const delay = 1000;

  return (
    <AutoComplete
      delay={delay}
    />
  );
};
