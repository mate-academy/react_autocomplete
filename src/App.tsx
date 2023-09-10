import { useContext } from 'react';
import './App.scss';
import 'bulma';
import { People } from './components/People';
import PeopleContext from './contexts/PeopleContext';

export const App: React.FC = () => {
  const { selectedPerson } = useContext(PeopleContext);

  return (
    <main className="section">
      <h1 className="title">{selectedPerson}</h1>

      <People />
    </main>
  );
};
