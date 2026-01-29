import React from 'react';
import styled from 'styled-components';
import { Track } from '../services/AudioService';
import { Clock } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--module-bg, ${props => props.theme.surface});
  color: var(--module-text, ${props => props.theme.text});
`;

const Header = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const List = styled.div`
  flex: 1;
  overflow: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.button<{ active: boolean }>`
  width: 100%;
  background: ${props => props.active ? props.theme.surfaceHover : 'transparent'};
  border: 1px solid ${props => props.active ? props.theme.accent : props.theme.border};
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  text-align: left;
  color: ${props => props.theme.text};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.surfaceHover};
  }
`;

const Title = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Empty = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
`;

interface RecentPlaysProps {
  recentTracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
}

const RecentPlays: React.FC<RecentPlaysProps> = ({ recentTracks, currentTrack, onTrackSelect }) => {
  return (
    <Container>
      <Header>
        <Clock size={14} />
        Recent Plays
      </Header>
      {recentTracks.length === 0 ? (
        <Empty>No recent plays</Empty>
      ) : (
        <List>
          {recentTracks.map(track => (
            <Item
              key={track.id}
              active={currentTrack?.id === track.id}
              onClick={() => onTrackSelect(track)}
            >
              <Title>{track.title}</Title>
              <Artist>{track.artist || 'Unknown Artist'}</Artist>
            </Item>
          ))}
        </List>
      )}
    </Container>
  );
};

export default RecentPlays;
