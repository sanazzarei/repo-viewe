import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './RepositoryDetails.module.css';
import { GitHubCommit, GitHubRepoDetails } from '../../type';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';


const RepositoryDetails = () => {
  const [expandedCommitSha, setExpandedCommitSha] = useState<string | null>(null);
  const { repoName } = useParams();

  const {
    data: repository,
    isLoading: isLoadingRepository,
    isError: isRepositoryError,
    error: repositoryError,
  } = useQuery<GitHubRepoDetails>({
    queryKey: ['repoDetails', repoName],
    queryFn: async () => {
      const response = await axios.get<GitHubRepoDetails>(
        `https://api.github.com/repos/JakeWharton/${repoName}`
      );
      return response.data;
    },
    staleTime: 300000,
    enabled: !!repoName,
  });

  const {
    data: recentCommits,
    isLoading: isLoadingCommits,
    isError: isCommitsError,
    error: commitsError,
  } = useQuery<GitHubCommit[]>({
    queryKey: ['repoCommits', repoName],
    queryFn: async () => {
      const response = await axios.get<GitHubCommit[]>(
        `https://api.github.com/repos/JakeWharton/${repoName}/commits?per_page=5`
      );
      return response.data;
    },
    staleTime: 300000,
    enabled: !!repoName,
  });


  useEffect(() => {
    if (isRepositoryError && repositoryError instanceof Error) {
      toast.error(`Failed to load repository: ${repositoryError.message}`);
    }
  }, [isRepositoryError, repositoryError]);

  useEffect(() => {
    if (isCommitsError && commitsError instanceof Error) {
      toast.error(`Failed to load commits: ${commitsError.message}`);
    }
  }, [isCommitsError, commitsError]);
  
  if ((isRepositoryError && !repository) || (isCommitsError && !recentCommits)) {
    return null;
  }

  if (isLoadingRepository || isLoadingCommits) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.fixedHeader}>
          <Skeleton width={300} height={30} />
          <Skeleton count={2} width="80%" />
        </div>
        <div className={styles.scrollableTimeline}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
              <Skeleton width="60%" height={20} />
              <Skeleton width="40%" height={14} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  

  return (
    <>
      <div className={styles.backLinkWrapper}>
        <Link to="/" className={styles.backLink}>← Back to Overview</Link>
      </div>

      <div className={styles.pageWrapper}>
        <div className={styles.fixedHeader}>
          <h1 className={styles.repoName}>{repository.name}</h1>
          <p className={styles.repoDescription}>{repository.description}</p>
        </div>

        <div className={styles.scrollableTimeline}>
          <div className={styles.timeline}>
            {recentCommits.map((commit) => (
              <div 
                key={commit.sha} 
                className={`${styles.commitItem} ${expandedCommitSha === commit.sha ? styles.active : ''}`}
              >
                <div className={styles.marker}></div>
                <div className={styles.commitContent}>
                  <h3
                    onClick={() =>
                      setExpandedCommitSha(prev =>
                        prev === commit.sha ? null : commit.sha
                      )
                    }
                    className={styles.commitMessage}
                  >
                    {commit.commit.message.split('\n')[0]}
                  </h3>
                  <p className={styles.commitAuthor}>By {commit.commit.author.name}</p>
                  {expandedCommitSha === commit.sha && (
                    <div className={styles.commitDetails}>
                      <p>Date: {new Date(commit.commit.author.date).toLocaleString()}</p>
                      <p>Commit SHA: {commit.sha}</p>
                      <a href={commit.html_url} target="_blank" rel="noreferrer">
                        View on GitHub
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RepositoryDetails;