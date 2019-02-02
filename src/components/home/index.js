import React, { useState } from 'react';
import URLField from '../url-field';
import styled from 'styled-components/macro';

const StyledHome = styled.div`
  max-height: calc(100vh - 120px);
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

const CenterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
`;

const Home = () => {
  let [url, setUrl] = useState('');

  return (
    <StyledHome>
      <H1>Welcome to Voyageurl</H1>
      <H2>Enter a url to shorten it!</H2>
      <CenterContent>
        <URLField setUrl={setUrl} />
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </CenterContent>
    </StyledHome>
  );
};

export default Home;
