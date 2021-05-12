import React from 'react';
import { VFSBrowser } from './_story_book';

const MutableVirtualFileSystem: React.FC = () => {
    return (
        <div className="story-wrapper">
            <VFSBrowser />
        </div>
    );
};

export default MutableVirtualFileSystem
