import React from 'react';
import { Redirect, withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';
import { removeURL } from '../../api-requests/remove-url';
import URLField from '../url-field';
import URLList from '../url-list';
import styled from 'styled-components/macro';

const cookies = new Cookies();

const ProfileContent = styled.div`
  margin: 0 auto;
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 60px;
`;

const H1 = styled.h1`
  text-align: center;
  font-size: 32px;
  margin-bottom: 10px;
`;

const H2 = styled.h2`
  text-align: center;
  font-size: 16px;
  margin-bottom: 10px;
`;

const LinkAccountButton = styled.div`
  padding: var(--pad);
  display: flex;
  align-content: center;
  cursor: pointer;
  width: max-content;
  border-radius: 5px;
`;

const OAuthAccounts = styled.div`
  display: flex;
`;

const Profile = props => {
  const linkAccount = accountHref => {
    cookies.set(
      'userCookie',
      jwt.sign(props.user, process.env.REACT_APP_SECRET_KEY),
      { path: '/' }
    );
    window.location.href = accountHref;
  };

  let authorizedUser;

  if (props.user && props.user._id) {
    // TODO: consider new route other than username
    authorizedUser = props.user.username
      .split(' ')
      .join('')
      .toLowerCase();
  }

  const urlRemove = urlData => {
    removeURL(urlData._id, props.user._id).then(updatedUser =>
      props.setUser(updatedUser)
    );
  };
  return (
    <ProfileContent>
      {props.user &&
      props.user.username &&
      props.location.pathname !== `/lion/${authorizedUser}` ? (
        <Redirect to={`/lion/${authorizedUser}`} />
      ) : (
        <div />
      )}
      {props.user &&
        props.user.username && (
          <Route
            exact
            path={`/lion/${authorizedUser}`}
            render={() => (
              <React.Fragment>
                <H1>Be Lionly, {props.user.username.split(' ')[0]}</H1>
                <H2>Lions don't use long links, and neither should you</H2>
                <URLField
                  user={props.user}
                  cookies={cookies}
                  setUser={props.setUser}
                />
                <OAuthAccounts>
                  {props.user.providers.facebookId === undefined ? (
                    <LinkAccountButton
                      onClick={() => linkAccount('/auth/facebook/')}
                    >
                      Facebook
                    </LinkAccountButton>
                  ) : (
                    <LinkAccountButton
                      style={{
                        color: props.user.providers.facebookId
                          ? 'var(--color-blue-l)'
                          : '',
                      }}
                    >
                      Facebook
                    </LinkAccountButton>
                  )}
                  {props.user.providers.googleId === undefined ? (
                    <LinkAccountButton
                      onClick={() => linkAccount('/auth/google/')}
                    >
                      Google
                    </LinkAccountButton>
                  ) : (
                    <LinkAccountButton
                      style={{
                        color: props.user.providers.googleId
                          ? 'var(--color-blue-l)'
                          : '',
                      }}
                    >
                      Google
                    </LinkAccountButton>
                  )}
                  {props.user.providers.githubId === undefined ? (
                    <LinkAccountButton
                      onClick={() => linkAccount('/auth/github/')}
                    >
                      Github
                    </LinkAccountButton>
                  ) : (
                    <LinkAccountButton
                      style={{
                        color: props.user.providers.githubId
                          ? 'var(--color-blue-l)'
                          : '',
                      }}
                    >
                      Github
                    </LinkAccountButton>
                  )}
                  {props.user.providers.twitterId === undefined ? (
                    <LinkAccountButton
                      onClick={() => linkAccount('/auth/twitter/')}
                    >
                      Twitter
                    </LinkAccountButton>
                  ) : (
                    <LinkAccountButton
                      style={{
                        color: props.user.providers.twitterId
                          ? 'var(--color-blue-l)'
                          : '',
                      }}
                    >
                      Twitter
                    </LinkAccountButton>
                  )}
                </OAuthAccounts>
                {props.urls &&
                  props.urls.length > 0 && (
                    <URLList
                      user={props.user}
                      setUser={props.setUser}
                      urls={props.urls}
                      setURLs={props.setURLs}
                      urlRemove={urlRemove}
                    />
                  )}
              </React.Fragment>
            )}
          />
        )}
    </ProfileContent>
  );
};

export default withRouter(Profile);
