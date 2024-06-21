import { Autocomplete } from "./components/Autocomplete";
import "./App.scss";
import React, { useState } from "react";
import { Person } from "./types/Person";

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name}
            (${selectedPerson.born} - ${selectedPerson.died})`
            : "No selected person"}
        </h1>

        <Autocomplete onSelect={setSelectedPerson} />
      </main>
    </div>
  );
};
