import React from 'react';
import './App.scss';
import { Main } from './components/Main';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LangProvider } from './components/LangContext';

export const App: React.FC = () => {
  return (
    <div className="App section">
      <LangProvider>
        <Header />
        <Main />
        <Footer />
      </LangProvider>
    </div>
  );
};
