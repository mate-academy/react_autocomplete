import { useContext, useReducer } from 'react';
import { LangSelector } from './LangSelector';
import { LangContext } from './LangContext';

interface Action {
  type: string;
  payload?: number;
}
function reducer(amount: number, action: Action) {
  switch (action.type) {
    case 'decrease':
      return amount - 1;
    case 'increase':
      return amount + 1;
    case 'add20':
      return amount + (action.payload || 1);
    default:
      return amount;
  }
}

export const Header = () => {
  const { lang, setLang } = useContext(LangContext);
  const [amount, dispatch] = useReducer(reducer, 1);

  const decrease = () => {
    dispatch({ type: 'decrease' });
  };

  const increase = () => {
    dispatch({ type: 'increase' });
  };

  const add20 = () => {
    dispatch({ type: 'add20', payload: 20 });
  };

  return (
    <header className="header">
      Mate academy
      <LangSelector value={lang} onChange={setLang} />
      <main>
        <button onClick={decrease} className="ml-2 mr-4">
          -
        </button>
        {amount}
        <button onClick={increase} className="ml-2 mr-2">
          +
        </button>
        <button onClick={add20} className="ml-1">
          +20
        </button>
      </main>
    </header>
  );
};
