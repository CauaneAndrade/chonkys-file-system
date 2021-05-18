import { setChonkyDefaults } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import Head from 'next/head'
import React from 'react'
import MenuBar from './components/MenuBar/MenuBar'
import VFSBrowser from './components/VFSBrowser'
setChonkyDefaults({ iconComponent: ChonkyIconFA })

const Home: React.FC = () => {
    return (
        <div>
            <Head>
                <title>title</title>
            </Head>
            <main>
                <MenuBar />
                <VFSBrowser />
            </main>
        </div>
    )
}

export default Home
