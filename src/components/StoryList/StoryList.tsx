import { useEffect, useState } from 'react';
import './story-list.css';
import StoryViewer from '../StoryViewer/StoryViewer';
import type { StoryUser } from '../../types/story';

const StoryList = () => {
  const [users, setUsers] = useState<StoryUser[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedUserIdx, setSelectedUserIdx] = useState(0);
  const [selectedStoryIdx, setSelectedStoryIdx] = useState(0);

  /*
   * Fetch the users data
   */
  useEffect(() => {
    fetch('/stories.json')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  /*
   * On click user image, set the index of user clicked and the index * of their first story.
   */
  const handleAvatarClick = (userIdx: number) => {
    setSelectedUserIdx(userIdx);
    setSelectedStoryIdx(0);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="story-list-container">
        {users.map((user, idx) => (
          <div
            className="story-avatar"
            key={user.userId}
            onClick={() => handleAvatarClick(idx)}
            style={{ cursor: 'pointer' }}
          >
            <div className="avatar-ring">
              <img src={user.image} alt={user.username} className="avatar-img" />
            </div>
            <span className="avatar-username">{user.username}</span>
          </div>
        ))}
      </div>
      {viewerOpen && (
        <StoryViewer
          users={users}
          initialUserIdx={selectedUserIdx}
          initialStoryIdx={selectedStoryIdx}
          storyDuration={5}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
};

export default StoryList;