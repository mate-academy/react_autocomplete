import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
// import { Person } from './types/Person';

function debounce(callback: () => void, delay: number) {
  const timerID = 0;

  return (...args: any) => {
    window.clearTimeout(timerID);
    window.setTimeout(() => {
      callback(...args as []);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [nameIs, setNameIs] = useState<string | undefined>('Carolus Haverbeke');
  const [bornIs, setBornIs] = useState<number | undefined>(1832);
  const [diedIs, setDiedIs] = useState<number | undefined>(1905);
  const [valueApplied, setValueApplied] = useState('');
  const [focus, setFocus] = useState(false);
  const applyValue = useCallback(debounce(setValueApplied as () =>
  void, 1000), []);

  const handlerInputChange = (e) => {
    setValue(e.target.value);
    applyValue(e.target.value);
  };

  const handlerItemChange = (person: string) => {
    const findPerson = peopleFromServer.find((p) => p.name === person);

    setValue(person);
    setNameIs(findPerson?.name);
    setBornIs(findPerson?.born);
    setDiedIs(findPerson?.died);
  };

  const filteredPosts = useMemo(() => {
    return peopleFromServer
      .filter((person) => person.name.toLowerCase()
        .includes(valueApplied.toLowerCase()))
      .map((person) => person.name);
  }, [valueApplied]);

  return (
    <main className="section">
      <h1 className="title">
        {`${nameIs} (${bornIs} = ${diedIs})`}
      </h1>

      <div className={cn('dropdown', {
        'is-active': focus === true
          && value === valueApplied,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={value}
            onFocus={() => setFocus(true)}
            onChange={handlerInputChange}

          />
        </div>
        {
          focus === true && (
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((person) => (
                    <div className="dropdown-item">
                      <button
                        type="button"
                        className="has-text-link"
                        onClick={() => handlerItemChange(person)}
                      >
                        {person}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">
                    <p className="has-text-link">No matching suggestions</p>
                  </div>
                )}

              </div>
            </div>
          )
        }
      </div>
    </main>
  );
};
