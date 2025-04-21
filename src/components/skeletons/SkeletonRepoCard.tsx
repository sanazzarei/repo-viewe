import Skeleton from 'react-loading-skeleton';

const SkeletonRepoCard = () => (
  <div style={{ padding: '1rem', borderRadius: '10px', background: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
    <Skeleton width="60%" height={20} />
    <Skeleton width="90%" height={14} count={2} style={{ marginTop: 8 }} />
    <Skeleton width={80} height={10} style={{ marginTop: 12 }} />
  </div>
);

export default SkeletonRepoCard;
