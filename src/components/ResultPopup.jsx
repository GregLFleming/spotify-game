import React from 'react';
import styled from 'styled-components';


export const ResultPopup = styled.div`
width: 500px;
height: 500px;
background-color: white;
border: 2px solid black;
color: black;
font-size: 1.2em;
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-evenly;
position: absolute;
z-index: 9;
overflow: auto
`;
export default ResultPopup;