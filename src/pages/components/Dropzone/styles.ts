import styled from 'styled-components'

export const DropContainer = styled.div.attrs({
    className: 'dropzone'
})`
    line-height: 83px;
    text-align: center;
    font-size: 1.2em;
    margin-bottom: 10;
    border-radius: 5px;
    color: darkgray;
    height: 100;
    border: 2.2px dashed blue;
    margin: 0 auto;
    cursor: pointer;
    transition: height 0.2s ease;
    font-family: Helvetica, sans-serif;
`
