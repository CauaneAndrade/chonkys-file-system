import { setChonkyDefaults } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import Head from 'next/head'
import React from 'react'
import VFSBrowser from './components/VFSBrowser'

setChonkyDefaults({ iconComponent: ChonkyIconFA })

const Home: React.FC = () => {
    return (
        <div>
            <Head>
                <title>title</title>
            </Head>
            <main>
                <h1>Empresa aqui</h1>
                <VFSBrowser />
            </main>
        </div>
    )
}

export default Home
