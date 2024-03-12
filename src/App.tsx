import React, { useState } from "react";
import "./App.scss";
import type { Person } from "./types/Person";
import { DropDown } from "./Components/DropDown";

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const { name, born, died } = selectPerson || {};

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectPerson ? `${name} (${born} - ${died})` : "No selected person"}
        </h1>

        <DropDown onSelected={setSelectPerson} />
      </main>
    </div>
  );
};
