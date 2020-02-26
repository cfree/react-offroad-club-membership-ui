import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Router from 'next/router';
import Loading from '../../utility/Loading';
import ErrorMessage from '../../utility/ErrorMessage';

const StyledForm = styled.form``;

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
  ) {
    requestReset(
      email: $email
    ) {
      message
    }
  }
`;

export default class ForgotPassword extends Component {
  state = { email: '' }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return <Mutation
      mutation={REQUEST_RESET_MUTATION}
      variables={this.state}
      refetchQueries={['CURRENT_USER_QUERY']}
    >
      {(requestReset, { data = {}, error, loading }) => {
        return <StyledForm method="post" onSubmit={async e => {
          e.preventDefault();
          await requestReset();
        }}>
          <h2>Forgot Password</h2>
          {data.requestReset && (
            <p>{data.requestReset.message}</p>
          )}
          <ErrorMessage error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="email">
              <input type="email" id="email" name="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} />
            </label>
            <button type="submit">Reset</button>
            <Loading loading={loading} />
          </fieldset>
        </StyledForm>;
      }}
    </Mutation>;
  }
};
