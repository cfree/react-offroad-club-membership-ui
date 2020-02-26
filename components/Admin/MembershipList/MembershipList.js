import { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import { roles } from '../../../lib/constants';
import Filters from '../../user/Filters';
import Roster from '../../user/Roster';
import ErrorMessage from '../../utility/ErrorMessage';
import Loading from '../../utility/Loading';

export class MembershipList extends Component {
  state = {
    activeFilters: {
      accountStatus: ['ACTIVE'],
      accountType: ['FULL', 'ASSOCIATE', 'EMERITUS'],
      role: [],
      office: [],
      title: [],
    },
    searchTerm: '',
  };

  handleFilterUpdate = (updatedVals, filter) => {
    this.setState(state => ({
      activeFilters: {
        ...state.activeFilters,
        [filter]: Object.values(updatedVals).map(obj => obj.value),
      },
    }));
  };

  handleClear = () => {
    this.setState({
      activeFilters: {
        accountStatus: [],
        accountType: [],
        role: [],
        office: [],
        title: [],
      },
    });
  };

  handleShowPastDue = () => {
    this.setState({
      activeFilters: {
        accountStatus: ['PAST_DUE'],
        accountType: ['FULL'],
        role: [],
        office: [],
        title: [],
      },
    });
  };

  handleShowDelinquent = () => {
    this.setState({
      activeFilters: {
        accountStatus: ['DELINQUENT'],
        accountType: ['FULL'],
        role: [],
        office: [],
        title: [],
      },
    });
  };

  handleShowInactive = () => {
    this.setState({
      activeFilters: {
        accountStatus: ['INACTIVE'],
        accountType: ['FULL'],
        role: [],
        office: [],
        title: [],
      },
    });
  };

  handleShowNewRegs = () => {
    this.setState({
      activeFilters: {
        accountStatus: ['LOCKED'],
        accountType: [],
        role: [],
        office: [],
        title: [],
      },
    });
  };

  render() {
    return (
      <div>
        <h2>Membership</h2>

        <aside>
          <h3>Quick Filters</h3>

          <ul>
            <li>
              <button onClick={this.handleShowNewRegs}>
                Locked New Registrations
              </button>
            </li>
            <li>
              <button onClick={this.handleShowPastDue}>
                Past Due Full Members
              </button>
            </li>
            <li>
              <button onClick={this.handleShowDelinquent}>
                Delinquent Full Members
              </button>
            </li>
            <li>
              <button onClick={this.handleShowInactive}>
                Inactive Full Members
              </button>
            </li>
            <li>
              <button onClick={this.handleClear}>Clear Filters</button>
            </li>
          </ul>
        </aside>

        <section>
          <Filters
            activeFilters={this.state.activeFilters}
            onFilterUpdate={this.handleFilterUpdate}
          />
          {/* 1-25 of x results */}
          <Roster filters={this.state.activeFilters} />
        </section>
      </div>
    );
  }
}

export default MembershipList;
