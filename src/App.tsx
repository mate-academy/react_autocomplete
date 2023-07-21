import React from 'react';
import './App.scss';
import { Autocomplete } from './components/Dropdown/Autocomplete';

const DELAY = 1000;

export const App: React.FC = () => {
  return (
    <Autocomplete delay={DELAY} />
  );
};
