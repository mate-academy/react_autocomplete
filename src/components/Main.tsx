import React, { useContext, useState } from 'react';
import { peopleFromServer } from '../data/people';
import { Autocomplete } from './Autocomplete';
import { Person } from '../types/Person';
import { ShoppingCart } from './ShoppingCart';
import { translate } from '../service/translate';
import { LangContext } from './LangContext';

const delay = 300;

const HomePageTitle = () => {
  const { lang } = useContext(LangContext);

  return <h1>{translate('homePage.title', lang)}</h1>;
};

const HomePageContent = () => {
  const { lang } = useContext(LangContext);

  return <section>{translate('homePage.content', lang)}</section>;
};

export const Main: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visible, setVisible] = useState(true);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <div className="HomePage">
          <HomePageTitle />
          <HomePageContent />
        </div>

        <h1 className="title" data-cy="title">
          {selectedPerson ? (
            <h1 key={selectedPerson.slug} className="title" data-cy="title">
              {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
            </h1>
          ) : (
            <h1 className="title" data-cy="title">
              No selected person
            </h1>
          )}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onPersonSelect={setSelectedPerson}
          delay={delay}
        />
        <div className="container">
          {visible ? (
            <button onClick={() => setVisible(false)}>Hide bonus card</button>
          ) : (
            <button onClick={() => setVisible(true)}>Show bonus card</button>
          )}
        </div>
        {visible && <ShoppingCart name="Bonus Card" />}
      </main>
    </div>
  );
};
