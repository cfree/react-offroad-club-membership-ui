import gql from 'graphql-tag';

export const UPCOMING_EVENTS_QUERY = gql`
  query UPCOMING_EVENTS_QUERY {
    myself {
      id
      firstName
      lastName
      avatar {
        smallUrl
      }
    }
    events: getUpcomingEvents {
      id
      title
      description
      featuredImage {
        smallUrl
      }
      startTime
      endTime
      host {
        firstName
        lastName
      }
      address
      rallyAddress
      rallyTime
      trail {
        id
        name
        avgDifficulty
        featuredImage {
          smallUrl
        }
      }
      rsvps {
        member {
          id
          firstName
          lastName
          avatar {
            smallUrl
          }
        }
        status
      }
    }
  }
`;

export const PAST_EVENTS_QUERY = gql`
  query PAST_EVENTS_QUERY {
    myself {
      id
      firstName
      lastName
      avatar {
        smallUrl
      }
    }
    events: getPastEvents {
      id
      title
      description
      featuredImage {
        smallUrl
      }
      startTime
      endTime
      host {
        firstName
        lastName
      }
      address
      rallyAddress
      rallyTime
      trail {
        id
        name
        avgDifficulty
        featuredImage {
          smallUrl
        }
      }
      rsvps {
        member {
          id
          firstName
          lastName
          avatar {
            smallUrl
          }
        }
        status
      }
    }
  }
`;
