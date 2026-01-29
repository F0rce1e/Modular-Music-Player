import React from 'react';
import styled from 'styled-components';
import { Library, Music3, Heart, Clock } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.surface};
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

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;
`;

const Card = styled.div`
  background: ${props => props.theme.surfaceHover};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardTitle = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CardValue = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

interface LibraryStatsProps {
  trackCount: number;
  playlistCount: number;
  favoriteCount: number;
  recentCount: number;
}

const LibraryStats: React.FC<LibraryStatsProps> = ({
  trackCount,
  playlistCount,
  favoriteCount,
  recentCount
}) => {
  return (
    <Container>
      <Header>
        <Library size={14} />
        Library Stats
      </Header>
      <Grid>
        <Card>
          <CardTitle>
            <Music3 size={14} />
            Tracks
          </CardTitle>
          <CardValue>{trackCount}</CardValue>
        </Card>
        <Card>
          <CardTitle>
            <Library size={14} />
            Playlists
          </CardTitle>
          <CardValue>{playlistCount}</CardValue>
        </Card>
        <Card>
          <CardTitle>
            <Heart size={14} />
            Favorites
          </CardTitle>
          <CardValue>{favoriteCount}</CardValue>
        </Card>
        <Card>
          <CardTitle>
            <Clock size={14} />
            Recent
          </CardTitle>
          <CardValue>{recentCount}</CardValue>
        </Card>
      </Grid>
    </Container>
  );
};

export default LibraryStats;
