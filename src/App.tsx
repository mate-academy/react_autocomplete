import { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Autocomplete/Autocomplete';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];

  const [query, setQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const closeDropdown = useCallback(() => {
    setTimeout(() => {
      setIsFocus(false);
    }, 200);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

      <div className="dropdown">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={event => setQuery(event.target.value)}
          onFocus={() => setIsFocus(true)}
          onBlur={closeDropdown}
        />

        <Autocomplete
          query={query}
          isFocus={isFocus}
          onSelect={(value) => setQuery(value)}
        />
      </div>
    </main>
  );
};
