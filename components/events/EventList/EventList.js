import { Component } from 'react';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Link from 'next/link';
import parse from 'html-react-parser';
import get from 'lodash/get';

import { UPCOMING_EVENTS_QUERY, PAST_EVENTS_QUERY } from './eventList.gql.js';
import {
  StyledEvents,
  StyledEventsList,
  StyledEvent,
} from './eventList.styles';
import AttendeeStatus from '../AttendeeStatus';
import {
  DEFAULT_EVENT_SMALL_SRC,
  DEFAULT_AVATAR_SMALL_SRC,
} from '../../../lib/constants';

class EventList extends Component {
  state = {
    attendees: [],
  };

  getAttendees = eventId => {
    if (this.state.attendees[eventId]) {
      const attendees = [...this.state.attendees[eventId]];
      return attendees.length > 3 ? attendees.slice(0, 3) : attendees;
    }

    return [];
  };

  handleUpdateEventAttendees = eventUpdate => {
    this.setState({ attendees: eventUpdate });
  };

  render() {
    const eventType = this.props.upcoming ? 'Upcoming' : 'Past';

    return (
      <Query
        query={this.props.upcoming ? UPCOMING_EVENTS_QUERY : PAST_EVENTS_QUERY}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <div>Error: {error.message}</div>;
          }

          const { events, myself } = data;

          return (
            <StyledEvents>
              <StyledEventsList>
                <h2>{eventType} Events</h2>
                {events.length > 0 ? (
                  events.map(event => {
                    const attendeesList = event.rsvps.filter(
                      rsvp => rsvp.status === 'GOING',
                    );

                    if (!this.state.attendees[event.id]) {
                      this.setState(state => ({
                        attendees: {
                          ...state.attendees,
                          [event.id]: attendeesList,
                        },
                      }));
                    }

                    const EVENT_IMAGE = get(
                      event,
                      'featuredImage.smallUrl',
                      DEFAULT_EVENT_SMALL_SRC,
                    );

                    const TRAIL_IMAGE = get(
                      event,
                      'trail.featuredImage.smallUrl',
                    );

                    return (
                      <StyledEvent key={event.id}>
                        <div className="event">
                          <div className="event__header">
                            <div className="event__header-details">
                              <div className="event-date">
                                <Link href={`/event/${event.id}`}>
                                  <a>
                                    {format(
                                      event.startTime,
                                      'ddd, MMM D, h:mm A',
                                    )}
                                  </a>
                                </Link>
                              </div>
                              <h2 className="event-title">
                                <Link href={`/event/${event.id}`}>
                                  <a>{event.title}</a>
                                </Link>
                              </h2>
                              <div className="event-location">
                                {event.address}
                              </div>
                            </div>
                            {TRAIL_IMAGE && (
                              <img
                                className="event-image"
                                src={TRAIL_IMAGE}
                                alt={event.trail.name}
                                height="100"
                                width="150"
                              />
                            )}
                            {EVENT_IMAGE && !TRAIL_IMAGE && (
                              <img
                                className="event-image"
                                src={EVENT_IMAGE}
                                alt={event.title}
                                height="100"
                                width="150"
                              />
                            )}
                          </div>
                          <div className="event-details">
                            <div>{parse(event.description)}</div>
                            <div className="event-meta">
                              {this.state.attendees[event.id] &&
                                this.state.attendees[event.id].length > 0 && (
                                  <span className="event-attendees">
                                    {event.rsvps && event.rsvps.length > 0 && (
                                      <span className="event-attendees__avatars">
                                        {this.getAttendees(event.id).map(
                                          rsvp => (
                                            <img
                                              src={get(
                                                rsvp.member,
                                                'avatar.smallUrl',
                                                DEFAULT_AVATAR_SMALL_SRC,
                                              )}
                                              key={rsvp.member.id}
                                              width="30"
                                            />
                                          ),
                                        )}
                                      </span>
                                    )}
                                    {this.state.attendees[event.id].length}{' '}
                                    attendees
                                  </span>
                                )}
                              <span className="event-rsvp">
                                
                                  {/* <span className="event-comment-count">
                                    12
                                  </span> */}
                                <AttendeeStatus
                                  isUpcoming={this.props.upcoming}
                                  attendees={this.state.attendees}
                                  eventId={event.id}
                                  user={myself}
                                  onUpdateEventAttendees={
                                    this.handleUpdateEventAttendees
                                  }
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </StyledEvent>
                    );
                  })
                ) : (
                  <h3>No events planned</h3>
                )}
              </StyledEventsList>
            </StyledEvents>
          );
        }}
      </Query>
    );
  }
}

export default EventList;
