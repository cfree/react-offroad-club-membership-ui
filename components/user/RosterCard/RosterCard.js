import styled from 'styled-components';
import Link from 'next/link';
import get from 'lodash/get';

import {
  getMemberType,
  getPhoneNumber,
  isAtLeastBoardMember,
} from '../../../lib/utils';
import { DEFAULT_AVATAR_SMALL_SRC } from '../../../lib/constants';
import Filter from '../../Login/Filter';

const StyledRosterCard = styled.div`
  padding: 5px 10px;
  display: grid;
  grid-column-gap: 10px;
  grid-template-columns: 30px 300px 1fr 1fr 1fr;

  &:nth-child(even) {
    background: ${({ theme }) => theme.colors.white_dark};
  }

  .member__img {
    margin: 0 auto;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    border: 1px solid black;
    position: relative;
    vertical-align: middle;
  }

  .member__actions {
    display: flex;
    justify-content: space-between;
  }
`;

const RosterCard = ({ user }) => {
  const phone = get(user, 'contactInfo.phone', '');

  return (
    <StyledRosterCard>
      <img
        className="member__img"
        src={(user.avatar && user.avatar.smallUrl) || DEFAULT_AVATAR_SMALL_SRC}
        alt={user.firstName}
      />
      <span>
        {user.firstName} {user.lastName}
      </span>
      <span>{getMemberType(user.accountType)}</span>
      {phone && <span>{getPhoneNumber(phone)}</span>}
      <span className="member__actions">
        <Link
          href={{
            pathname: 'message',
            query: { to: user.username },
          }}
        >
          <a>Message</a>
        </Link>
        <Link href={`/profile/${user.username}`}>
          <a>View</a>
        </Link>
        <Filter roleCheck={isAtLeastBoardMember}>
          <Link href={`/admin-profile/${user.username}`}>
            <a>Edit</a>
          </Link>
        </Filter>
      </span>
    </StyledRosterCard>
  );
};

export default RosterCard;
