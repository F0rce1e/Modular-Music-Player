import React from 'react';
import styled from 'styled-components';
import { Track } from '../services/AudioService';
import { Disc3, Play, Pause } from 'lucide-react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  gap: 14px;
  background: var(--module-bg, ${props => props.theme.surface});
  color: var(--module-text, ${props => props.theme.text});
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  font-weight: 600;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const Artwork = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 16px;
  background: ${props => props.theme.surfaceHover};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  overflow: hidden;
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
`;

const Empty = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
`;

interface NowPlayingProps {
  currentTrack: Track | null;
  isPlaying: boolean;
}

const NowPlaying: React.FC<NowPlayingProps> = ({ currentTrack, isPlaying }) => {
  return (
    <Wrapper>
      <Header>Now Playing</Header>
      {currentTrack ? (
        <Body>
          <Artwork>
            <Disc3 size={36} />
          </Artwork>
          <Info>
            <Title>{currentTrack.title}</Title>
            <Artist>{currentTrack.artist || 'Unknown Artist'}</Artist>
            <Status>
              {isPlaying ? <Play size={14} /> : <Pause size={14} />}
              {isPlaying ? 'Playing' : 'Paused'}
            </Status>
          </Info>
        </Body>
      ) : (
        <Empty>Nothing is playing</Empty>
      )}
    </Wrapper>
  );
};

export default NowPlaying;
