import styled from 'styled-components'


const Bar = styled.div.attrs({
    className: 'menu-bar'
})`
    line-height: 5px;
    display: flex;
    width: 100%;
    overflow: hidden;
    background: lightgrey;
    align-items: center;
`

const Logo = styled.div.attrs({
    className: 'company-logo'
})`
    width: 10%;
    height: 100%;
    align-items: right;
`

const UserButton = styled.div.attrs({
    className: 'user-button'
})`
    color: black;
    float: left;
    height: 5%
`

export { Bar, Logo, UserButton }

