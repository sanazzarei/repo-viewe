import { Routes, Route } from 'react-router-dom';
import UserOverview from './pages/userOverview/UserOverview';
import RepositoryDetails from './pages/repositoryDetails/RepositoryDetails';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserOverview />} />
        <Route path="/repo/:repoName" element={<RepositoryDetails />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={4000} />
    </>
  );
}

export default App;

