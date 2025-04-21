import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import RepoItem from '../../components/repoItem/RepoItem';
import UserProfile from '../../components/userProfile/UserProfile';
import styles from './userOverview.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GitHubRepo } from '../../type';
import RepoSortDropdown from '../../components/repoSortDropdown/RepoSortDropdown';
import SkeletonUserProfile from '../../components/skeletons/SkeletonUserProfile';
import SkeletonRepoCard from '../../components/skeletons/SkeletonRepoCard';
import { toast } from 'react-toastify';

import {
  faMapMarkerAlt,
  faBuilding,
  faLink,
  faUsers,
  faBox
} from '@fortawesome/free-solid-svg-icons';

const UserOverview = () => {
  const [sortOption, setSortOption] = useState<'default' | 'stars' | 'latest' | 'created'>('default');

  const {
    data: repositories, 
    isLoading, 
    isError: isRepositoriesError, 
    error: repositoriesError
  } = useQuery<GitHubRepo[]>({
    queryKey: ['repositories'],
    queryFn: async () => { 
      const response = await axios.get<GitHubRepo[]>('https://api.github.com/users/JakeWharton/repos');
      return response.data;
    },
    staleTime: 300000,
  });
  
  const {  
    data: userProfile, 
    isLoading: profileLoading, 
    isError: isProfileError, 
    error: profileError
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await axios.get('https://api.github.com/users/JakeWharton');
      return response.data;
    },
    staleTime: 300000,
  });

  useEffect(() => {
    if (isRepositoriesError && repositoriesError instanceof Error) {
      toast.error(`Failed to load repositories: ${repositoriesError.message}`);
    }
  }, [isRepositoriesError, repositoriesError]);
  
  useEffect(() => {
    if (isProfileError && profileError instanceof Error) {
      toast.error(`Failed to load user profile: ${profileError.message}`);
    }
  }, [isProfileError, profileError]);

  const sortedRepositories = useMemo(() => {
    if (!repositories) return [];
  
    switch (sortOption) {
      case 'stars':
        return [...repositories].sort((a, b) => b.stargazers_count - a.stargazers_count);
      case 'latest':
        return [...repositories].sort(
          (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        );
      case 'created':
        return [...repositories].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return repositories;
    }
  }, [repositories, sortOption]);

  if ((isRepositoriesError && !repositories) || (isProfileError && !userProfile)) {
    return null;
  }

  if (isLoading || profileLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.gridContainer}>
          <div className={styles.profileSection}>
            <SkeletonUserProfile />
          </div>
  
          <div className={styles.repoSection}>
            <div className={styles.repoHeaderRow}>
              <h2 className={styles.repoHeader}>Repositories</h2>
              <div style={{ width: '100%', maxWidth: '200px' }}><Skeleton height={30} /></div>
            </div>
  
            <div className={styles.repoGrid}>
              {[...Array(6)].map((_, index) => (
                <SkeletonRepoCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.gridContainer}>
        <div className={styles.profileSection}>
          <UserProfile
            name={userProfile.name}
            avatarUrl={userProfile.avatar_url}
          />

          <div className={styles.profileDetails}>
            {userProfile.bio && <p>{userProfile.bio}</p>}

            <p>
              <FontAwesomeIcon icon={faUsers} />{' '}
              <strong>{userProfile.followers}</strong> followers ·{' '}
              <strong>{userProfile.following}</strong> following
            </p>

            {userProfile.location && (
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {userProfile.location}
              </p>
            )}

            {userProfile.company && (
              <p>
                <FontAwesomeIcon icon={faBuilding} /> {userProfile.company}
              </p>
            )}
          {userProfile.blog && (
              <p>
               <FontAwesomeIcon icon={faLink} />{' '}
                 <a 
                      href={userProfile.blog.startsWith('http') ? userProfile.blog : `https://${userProfile.blog}`} 
                      target="_blank" 
                      rel="noreferrer"
                  >
                  {userProfile.blog}
                </a>
               </p>
            
            )}

            <p>
              <FontAwesomeIcon icon={faBox} />{' '}
              Public Repositories: <strong>{userProfile.public_repos}</strong>
            </p>
          </div>
        </div>

        <div className={styles.repoSection}>
          <div className={styles.repoHeaderRow}>
            <h2 className={styles.repoHeader}>Repositories</h2>
            <RepoSortDropdown value={sortOption} onChange={setSortOption} />
          </div>
          <div className={styles.repoGrid}>
            {sortedRepositories.map((repo) => (
              <div key={repo.id} className={styles.repoCard}>
                <RepoItem
                  id={repo.id}
                  name={repo.name}
                  description={repo.description}
                  stars={repo.stargazers_count}
                  watchers={repo.watchers_count}
                  forks={repo.forks_count}
                  language={repo.language}
                />
              </div>
            ))}
          </div>
          <div className={styles.repoSpacer} />
        </div>
      </div>
    </div>
  );
};

export default UserOverview;