import React, { useEffect, useState } from 'react';
import './story-viewer.css';
import type { StoryUser } from '../../types/story';

interface StoryViewerProps {
    users: StoryUser[];
    initialUserIdx: number;
    initialStoryIdx: number;
    storyDuration: number;
    onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ users, initialUserIdx, initialStoryIdx, storyDuration = 5, onClose }) => {
    const [userIdx, setUserIdx] = useState(initialUserIdx);
    const [storyIdx, setStoryIdx] = useState(initialStoryIdx);
    const [imageLoaded, setImageLoaded] = useState(false);

    const user = users[userIdx];
    const story = user.stories[storyIdx];

    /*
     * Auto increment of stories
     */
    useEffect(() => {
        if (!imageLoaded) {
            return;
        }

        const timer: number = setTimeout(() => {
            goNext();
        }, storyDuration * 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [storyIdx, userIdx, imageLoaded]);

    /*
     * Returns styles for the progress bar depending on it's current 
     * state
     */
    const getProgressBarStyles = (idx: number) => {
        let className = 'story-viewer-progress-bar';
        if (idx < storyIdx) {
            className += ' finished';
        }
        if (idx === storyIdx && imageLoaded) {
            className += ' active';
        }
        return className;
    }

    /*
     * Handler for next image
     */
    const goNext = () => {
        setImageLoaded(false);

        if (storyIdx < user.stories.length - 1) {
            setStoryIdx(storyIdx + 1);
            setImageLoaded(false);
        } else if (userIdx < users.length - 1) {
            setUserIdx(userIdx + 1);
            setStoryIdx(0);
        } else {
            onClose();
        }
    };

    /*
     * Handler for prev image
     */
    const goPrev = () => {
        setImageLoaded(false);

        if (storyIdx > 0) {
            setStoryIdx(storyIdx - 1);
        } else if (userIdx > 0) {
            const prevUser = users[userIdx - 1];
            setUserIdx(userIdx - 1);
            setStoryIdx(prevUser.stories.length - 1);
        } else {
            onClose();
        }
    };

    /*
     * Detects which side of the image was clicked
     */
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Current viewport width
        const width = window.innerWidth;
        // X cordinates of the click
        const x = e.clientX;
        if (x < width / 2) {
            goPrev();
        } else {
            goNext();
        }
    };

    if (!user || !story) return null;

    return (
        <div className="story-viewer-overlay" onClick={handleClick}>
            <div className="story-viewer-content">
                {/* Story Image */}
                <div className="story-viewer-img-wrapper">
                    <img
                        key={userIdx + '-' + storyIdx}
                        src={story.url}
                        alt={story.title}
                        className={`story-viewer-img${imageLoaded ? ' loaded' : ''}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    {!imageLoaded && <div className="loader">Loading...</div>}
                </div>

                {/* Username */}
                <div className="story-viewer-header">
                    <img src={user.image} alt={user.username} className="story-viewer-avatar" />
                    <span className="story-viewer-username">{user.username}</span>
                </div>

                {/* Close icon */}
                <button className="story-viewer-close" onClick={() => onClose()}>&times;</button>

                {/* Progress Bar */}
                <div className="story-viewer-progress-bars">
                    {user.stories.map((s, idx) => (
                        <div key={s.id} className='story-viewer-progress-bar-container'>
                            <div
                                style={{
                                    animationDuration: `${storyDuration}s`
                                }}
                                className={getProgressBarStyles(idx)}
                                key={userIdx + '-' + idx}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoryViewer;