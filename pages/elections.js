import CreateElection from '../components/voting/CreateElection';
import EditElection from '../components/voting/EditElection';
import PollingPlace from '../components/voting/PollingPlace';
import Gate from '../components/Login/Gate';
import { isAtLeastBoardMember, isNotLocked } from '../lib/utils';

const PollManagementPage = ({ query }) => {
  const redirect = query.edit ? `/elections?edit=${query.edit}` : '/elections';
  let Component = <PollingPlace admin />;

  if (query.action && query.action === 'create') {
    Component = <CreateElection />;
  } else if (query.edit) {
    Component = <EditElection election={query.edit} />;
  }
  {
    /* <Gate redirect={redirect} statusCheck={isNotLocked} roleCheck={isAtLeastBoardMember}></Gate> */
  }
  return (
    <Gate redirect={redirect} statusCheck={() => false}>
      {Component}
    </Gate>
  );
};

export default PollManagementPage;
