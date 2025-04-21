export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string;
  pushed_at: string;
  created_at: string;
}

  
  export interface UserProfileProps {
    name: string;
    avatarUrl: string;
  };

  export interface RepoItemProps {
    id: number;
    name: string;
    description: string | null;
    stars: number;
    watchers: number;
    forks: number;
    language: string | null;
  };

  export interface GitHubCommit {
    sha: string;
    html_url: string;
    commit: {
      message: string;
      author: {
        name: string;
        email: string;
        date: string;
      };
    };
  }
  export interface GitHubRepoDetails {
    name: string;
    description: string;
  }

  export type RepoSortOption = 'default' | 'stars' | 'latest' | 'created';

  export interface RepoSortDropdownProps {
    value: RepoSortOption;
    onChange: (value: RepoSortOption) => void;
  }