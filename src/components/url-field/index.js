import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

const Input = styled.input`
  border: 1px solid black;
  padding: 0.5em;
  &:focus {
    border: 1px solid black;
  }
`;

function URLField(props) {
  let [url, setUrl] = useState('');

  const handleChange = e => {
    setUrl(e.target.value);
  };

  const useFetch = e => {
    e.preventDefault();
    console.log('url: ', url);
    fetch(`${process.env.REACT_APP_DOMAIN}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        console.log('shortened url: ', process.env.REACT_APP_DOMAIN + res.hash);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log('url: ', url);
  });

  return (
    <form onSubmit={useFetch}>
      <Input type="text" onChange={handleChange} />
    </form>
  );
}

export default URLField;
