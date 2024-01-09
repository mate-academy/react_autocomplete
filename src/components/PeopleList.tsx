/* eslint-disable */
import React from 'react';
import { Person } from '../types/Person';

type Props = {
  posts: Person[];
  onSelect: (selectedName: string) => void;
};

export const PeopleList: React.FC<Props> = React.memo(
  ({ posts, onSelect }) => {
    return (
      <div className="dropdown-item">
        <ul>
          {posts.map(post => (
            <li
              key={post.id}
              className="has-text-link"
              onClick={() => {
                onSelect(post.name);
              }}
            >
              {post.name}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
