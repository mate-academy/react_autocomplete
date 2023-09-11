import { FC, memo } from 'react';

import { Person } from '../../types/Person';

import styles from './SearchTitle.module.scss';

type TSearchTitleProps = {
  selectedUser: Person | null;
  setSelectedUser: (newPerson: Person | null) => void
};

export const SearchTitle: FC<TSearchTitleProps> = memo(({
  selectedUser,
  setSelectedUser,
}) => (
  <h1 className="title">
    {selectedUser
      ? (
        <>
          {`${selectedUser?.name} (${selectedUser?.died - selectedUser?.born} age)`}
          <button
            type="button"
            className={`button ${styles.resetButton}`}
            onClick={() => setSelectedUser(null)}
          >
            X
          </button>
        </>
      )
      : (
        <span>No selected user</span>
      )}
  </h1>
));
