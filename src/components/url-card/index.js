import React, { useState, useEffect, useRef } from 'react';
import { fetchMetadata } from '../../api-requests/fetch-metadata';
import { removeURL } from '../../api-requests/remove-url';
import LoadingEllipsis from '../loading-ellipsis';
import { truncate } from '../../lib/util';
import styled from 'styled-components';

const URLCardContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const URLCardLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
`;

const URLCardRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
`;

const CopyButton = styled.div`
  display: flex;
  border: 1px solid var(--color-orange);
  align-items: center;
  justify-content: center;
  width: 75px;
  padding: 0.5em;
  cursor: pointer;
  &:hover {
    color: white;
    background-color: var(--color-orange);
  }
`;

const URLCard = props => {
  const [metadata, setMetadata] = useState();
  const shortenedURLRef = useRef(null);

  const copyToClipboard = e => {
    shortenedURLRef.current.select();
    document.execCommand('copy');
    e.target.focus();
  };
  const handleRemove = () => {
    removeURL(props.url._id, props.user._id).then(result =>
      props.setUser(result)
    );
  };

  useEffect(
    () => {
      if (props.isVisible && !metadata) {
        fetchMetadata(props.url).then(data => setMetadata(data.metadata));
      }
    },
    [props.isVisible]
  );

  return (
    <URLCardContainer>
      <URLCardLeft>
        {metadata ? (
          <div>{truncate(metadata.title, 55)}</div>
        ) : (
          <LoadingEllipsis />
        )}
        <a href={props.url.url} target="_#" rel="noopener noreferrer">
          {truncate(props.url.url, 55)}
        </a>
        <a href={props.url.url} target="_#" rel="noopener noreferrer">
          <input
            ref={shortenedURLRef}
            value={`${process.env.REACT_APP_DOMAIN}/${props.url.hash}`}
            style={{ cursor: 'pointer' }}
            readOnly
          />
        </a>
      </URLCardLeft>
      <URLCardRight>
        <CopyButton onClick={handleRemove}>Remove</CopyButton>
        <CopyButton onClick={copyToClipboard}>Copy</CopyButton>
      </URLCardRight>
    </URLCardContainer>
  );
};

export default URLCard;
