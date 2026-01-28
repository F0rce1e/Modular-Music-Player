import React from 'react';
import styled from 'styled-components';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Track } from '../services/AudioService';
import { Plus, Music, Search } from 'lucide-react';

const { ipcRenderer } = window.require('electron');

const LibraryContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 10px;
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchInput = styled.input`
  background-color: ${props => props.theme.surfaceHover};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 6px 12px 6px 32px;
  color: ${props => props.theme.text};
  width: 180px;
  outline: none;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:focus {
    width: 240px;
    border-color: ${props => props.theme.accent};
    background-color: ${props => props.theme.surface};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const AddButton = styled.button`
  background-color: ${props => props.theme.accent};
  color: white;
  border: none;
  border-radius: 16px;
  padding: 6px 16px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: ${props => props.theme.accentHover};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ListWrapper = styled.div`
  flex: 1;
  width: 100%;
`;

const TrackRow = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  background-color: ${props => props.active ? props.theme.surfaceHover : 'transparent'};
  height: 100%;
  border-bottom: 1px solid ${props => props.theme.border}22;

  &:hover {
    background-color: ${props => props.theme.surfaceHover};
  }
`;

const Index = styled.div`
  width: 32px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
`;

const TrackInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 8px 0;
`;

const TrackTitle = styled.div<{ active: boolean }>`
  font-weight: 500;
  font-size: 0.95rem;
  color: ${props => props.active ? props.theme.accent : props.theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.textSecondary};
  gap: 16px;

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

interface MusicLibraryProps {
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
  onAddTracks: (newTracks: Track[]) => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({ tracks, currentTrack, onTrackSelect, onAddTracks }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (track.artist && track.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddMusic = async () => {
    const filePaths: string[] = await ipcRenderer.invoke('open-file-dialog');
    if (filePaths && filePaths.length > 0) {
      const newTracks: Track[] = filePaths.map(filePath => {
        const fileName = filePath.split(/[\\/]/).pop() || filePath;
        const parts = fileName.replace(/\.[^/.]+$/, "").split(' - ');
        return {
          id: Math.random().toString(36).substring(2, 11),
          path: filePath,
          title: parts.length > 1 ? parts[1] : parts[0],
          artist: parts.length > 1 ? parts[0] : 'Unknown Artist',
        };
      });
      onAddTracks(newTracks);
    }
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const track = filteredTracks[index];
    const isActive = currentTrack?.id === track.id;

    return (
      <div style={style}>
        <TrackRow active={isActive} onClick={() => onTrackSelect(track)}>
          <Index>{index + 1}</Index>
          <TrackInfo>
            <TrackTitle active={isActive}>{track.title}</TrackTitle>
            <TrackArtist>{track.artist}</TrackArtist>
          </TrackInfo>
        </TrackRow>
      </div>
    );
  };

  return (
    <LibraryContainer>
      <Header>
        <Title>Library</Title>
        <HeaderActions>
          <SearchWrapper>
            <Search size={14} />
            <SearchInput 
              placeholder="Search library..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
          <AddButton onClick={handleAddMusic}>
            <Plus size={16} />
            Add
          </AddButton>
        </HeaderActions>
      </Header>
      
      <ListWrapper>
        {filteredTracks.length > 0 ? (
          <div style={{ height: '100%', width: '100%' }}>
            <AutoSizerWrapper>
              {(height: number, width: number) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemCount={filteredTracks.length}
                  itemSize={56}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizerWrapper>
          </div>
        ) : (
          <EmptyState>
            <Music size={48} />
            <p>{searchTerm ? 'No tracks found' : 'Your library is empty'}</p>
          </EmptyState>
        )}
      </ListWrapper>
    </LibraryContainer>
  );
};

// Helper for AutoSizing without heavy dependency
const AutoSizerWrapper: React.FC<{ children: (height: number, width: number) => React.ReactNode }> = ({ children }) => {
  const [size, setSize] = React.useState({ height: 0, width: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setSize({
          height: entry.contentRect.height,
          width: entry.contentRect.width
        });
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} style={{ width: '100%', height: '100%' }}>{children(size.height, size.width)}</div>;
};

export default MusicLibrary;
