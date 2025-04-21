import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RepoItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faCodeFork } from '@fortawesome/free-solid-svg-icons';
import { RepoItemProps } from '../../type';


const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  Go: '#00ADD8',
  C: '#555555',
  'C++': '#f34b7d',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

const RepoItem: React.FC<RepoItemProps> = ({
  id,
  name,
  description,
  stars,
  watchers,
  forks,
  language,
}) => {
  return (
    <li className={styles.repoItem} key={id}>
      <div className={styles.topRow}>
        <div className={styles.repoStatsBox}>
          <span className={styles.iconStar}>
            <FontAwesomeIcon icon={faStar} /> {stars}
          </span>
          <span className={styles.iconWatch}>
            <FontAwesomeIcon icon={faEye} /> {watchers}
          </span>
          <span className={styles.iconFork}>
            <FontAwesomeIcon icon={faCodeFork} /> {forks}
          </span>
        </div>
      </div>

      <Link to={`/repo/${name}`} className={styles.repoLink}>
        <strong>{name}</strong>
      </Link>

      {description && (
         <p className={styles.repoDescription}>{description}</p>
         )}

       {language && (
         <div className={styles.languageTag}>
         <span
           className={styles.languageDot}
           style={{ backgroundColor: languageColors[language] || '#ccc' }}
          />
        {language}
       </div>
        )}
    </li>
  );
};

export default RepoItem;
