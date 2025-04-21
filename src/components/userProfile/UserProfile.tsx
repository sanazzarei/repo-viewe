import React from 'react';
import styles from './UserProfile.module.css';
import { UserProfileProps } from '../../type';


const UserProfile: React.FC<UserProfileProps> = ({ name, avatarUrl }) => {
  return (
    <div className={styles.container}>
      <img
        src={avatarUrl}
        alt={`${name} avatar`}
        className={styles.avatar}
      />
      <h2 className={styles.name}>{name}</h2>
    </div>
  );
};

export default UserProfile;
