import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonUserProfile = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Skeleton circle width={120} height={120} />
    <Skeleton width={180} height={25} style={{ marginTop: 16 }} />
    <Skeleton count={5} width={250} height={15} style={{ marginTop: 10 }} />
  </div>
);

export default SkeletonUserProfile;
