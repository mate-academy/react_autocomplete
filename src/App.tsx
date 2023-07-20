import React from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';

const delay = 1000;

export const App: React.FC = () => (
  <Autocomplete
    delay={delay}
  />
);
