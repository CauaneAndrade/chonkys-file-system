import React from 'react';
import { Bar, Logo, UserButton } from './styles';

const MenuBar: React.FC = () => {
    return (
        <Bar>
            <Logo> <img src="/img/bizpokelogo.png" /> </Logo>
            <UserButton> <img src="/img/bizpokelogo.png" /> </UserButton>
            <hr />
        </Bar>
    )
}

export default MenuBar
