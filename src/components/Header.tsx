import { useContext } from 'react';
import { LangSelector } from './LangSelector';
import { LangContext } from './LangContext';

export const Header = () => {
  const { lang, setLang } = useContext(LangContext);

  return (
    <header className="header">
      Mate academy
      <LangSelector value={lang} onChange={setLang} />
    </header>
  );
};
