export interface Story {
  id: number;
  url: string;
  title: string;
}

export interface StoryUser {
  userId: number;
  username: string;
  image: string;
  stories: Story[];
}
