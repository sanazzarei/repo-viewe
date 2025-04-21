import React from 'react';
import { RepoSortDropdownProps, RepoSortOption } from '../../type';
import styles from './RepoSortDropdown.module.css';

const RepoSortDropdown: React.FC<RepoSortDropdownProps> = ({ value, onChange }) => {
  return (
    <select
      className={styles.dropdown}
      value={value}
      onChange={(e) => onChange(e.target.value as RepoSortOption)}
    >
      <option value="default">Default</option>
      <option value="stars">Stars (Most → Least)</option>
      <option value="latest">Last Commit (Newest → Oldest)</option>
      <option value="created">Recently Created</option>
    </select>
  );
};

export default RepoSortDropdown;
