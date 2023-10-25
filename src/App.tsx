/* eslint-disable */
import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Autofill } from './Components/Autofill';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person>();

  return (

    <Autofill selected={selected} setSelected={setSelected} />

  );
};
