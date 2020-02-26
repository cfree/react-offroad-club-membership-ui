import Dashboard from '../components/dashboard/Dashboard';
import Gate from '../components/Login/Gate';
import { isAtLeastGuestMember, isNotLocked } from '../lib/utils';

const Home = () => (
  <Gate>
    <Dashboard />
  </Gate>
);

export default Home;
