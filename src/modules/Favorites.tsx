import React from 'react';
import styled from 'styled-components';
import { Track } from '../services/AudioService';
import { Heart, HeartOff } from 'lucide-react';

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
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  font-weight: 600;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? props.theme.accent : props.theme.surfaceHover};
  border: 1px solid ${props => props.active ? props.theme.accent : props.theme.border};
  color: ${props => props.active ? '#fff' : props.theme.text};
  border-radius: 12px;
  padding: 6px 10px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? props.theme.accentHover : props.theme.surface};
  }
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

const TrackTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
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

interface FavoritesProps {
  favorites: Track[];
  currentTrack: Track | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onTrackSelect: (track: Track) => void;
}

const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  currentTrack,
  isFavorite,
  onToggleFavorite,
  onTrackSelect
}) => {
  return (
    <Container>
      <Header>
        <Title>
          <Heart size={14} />
          Favorites
        </Title>
        <ToggleButton active={isFavorite} onClick={onToggleFavorite}>
          {isFavorite ? <HeartOff size={12} /> : <Heart size={12} />}
          {isFavorite ? 'Unfavorite' : 'Favorite'}
        </ToggleButton>
      </Header>
      {favorites.length === 0 ? (
        <Empty>No favorites yet</Empty>
      ) : (
        <List>
          {favorites.map(track => (
            <Item
              key={track.id}
              active={currentTrack?.id === track.id}
              onClick={() => onTrackSelect(track)}
            >
              <TrackTitle>{track.title}</TrackTitle>
              <TrackArtist>{track.artist || 'Unknown Artist'}</TrackArtist>
            </Item>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Favorites;
