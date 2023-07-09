import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

    </main>
  );
};
