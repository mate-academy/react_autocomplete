import { peopleFromServer } from './data/people';
import { Container } from './components/Container';
import { Main } from './components/Main';
import './App.scss';

export const App: React.FC = () => {
  return (
    <Container>
      <Main people={peopleFromServer} />
    </Container>
  );
};
