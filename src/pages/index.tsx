import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import Head from 'next/head';
import React from "react";
// import MutableVirtualFileSystem from './_story_book_demo';
// import Test from './_test2';
import MutableVirtualFileSystem from './_test';
setChonkyDefaults({ iconComponent: ChonkyIconFA });

const Home: React.FC = () => {
    return (
        <div>
            <Head>
                <title>Create Next App</title>
            </Head>
            <main>
                <h1>Empresa aqui</h1>
                <MutableVirtualFileSystem />
            </main>
        </div>
    )
}

export default Home
