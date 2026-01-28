import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Responsive, type Layout, type ResponsiveLayouts } from 'react-grid-layout';
import { WidthProvider } from 'react-grid-layout/legacy';
import { audioService, Track } from './services/AudioService';
import MusicLibrary from './modules/MusicLibrary';
import PlaybackControls from './modules/PlaybackControls';
import Playlist from './modules/Playlist';
import Sidebar, { Collection } from './modules/Sidebar';
import PlayerDetails from './modules/PlayerDetails';
import WindowTitleBar from './components/WindowTitleBar';
import ModuleContainer from './components/ModuleContainer';
import { lightTheme } from './styles/theme';
import { Layout as LayoutIcon, Unlock } from 'lucide-react';

const ResponsiveGridLayout = WidthProvider(Responsive);

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    user-select: none;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  }
  
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.textSecondary};
  }

  .react-grid-placeholder {
    background: ${props => props.theme.accent} !important;
    border-radius: 12px !important;
    opacity: 0.1 !important;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainArea = styled.div`
  flex: 1;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
`;

const Toolbar = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
`;

const ToolButton = styled.button<{ active?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: ${props => props.active ? props.theme.accent : props.theme.surface};
  color: ${props => props.active ? '#fff' : props.theme.text};
  border: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.active ? props.theme.accentHover : props.theme.surfaceHover};
  }
`;

const ControlPanelWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: ${props => props.theme.glassBackground};
  backdrop-filter: blur(20px);
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  z-index: 100;
`;

const initialLayouts: ResponsiveLayouts<string> = {
  lg: [
    { i: 'sidebar', x: 0, y: 0, w: 2, h: 10 },
    { i: 'library', x: 2, y: 0, w: 7, h: 10 },
    { i: 'playlist', x: 9, y: 0, w: 3, h: 10 },
  ],
};

const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [layouts, setLayouts] = useState<ResponsiveLayouts<string>>(initialLayouts);

  useEffect(() => {
    const savedLayouts = localStorage.getItem('player-layouts');
    if (savedLayouts) {
      const parsed = JSON.parse(savedLayouts) as ResponsiveLayouts<string>;
      setLayouts(parsed);
    }
  }, []);

  const onLayoutChange = (currentLayout: Layout, allLayouts: ResponsiveLayouts<string>) => {
    setLayouts(allLayouts);
    localStorage.setItem('player-layouts', JSON.stringify(allLayouts));
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    audioService.play(track);
    setIsPlaying(true);
  };

  const handleAddTracks = (newTracks: Track[]) => {
    setTracks(prev => [...prev, ...newTracks]);
  };

  const handleRemoveTrack = (trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
    if (currentTrack?.id === trackId) {
      audioService.stop();
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    const result = Array.from(tracks);
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
      result.splice(endIndex, 0, removed);
      setTracks(result);
    }
  };

  const handleCreateCollection = () => {
    const name = prompt('Enter playlist name:');
    if (name) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name,
        trackIds: []
      };
      setCollections(prev => [...prev, newCollection]);
    }
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    if (activeCollectionId === id) setActiveCollectionId(null);
  };

  const handleRenameCollection = (id: string, newName: string) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const handleNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handleTrackSelect(tracks[nextIndex]);
  };

  const handlePrev = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handleTrackSelect(tracks[prevIndex]);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <AppContainer>
        <GlobalStyle />
        <WindowTitleBar />
        
        <MainArea>
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            dragConfig={{ enabled: isEditing, handle: '.drag-handle' }}
            resizeConfig={{ enabled: isEditing }}
            onLayoutChange={onLayoutChange}
            margin={[12, 12]}
          >
            <div key="sidebar">
              <ModuleContainer title="Navigator" isEditing={isEditing}>
                <Sidebar 
                  collections={collections}
                  activeCollectionId={activeCollectionId}
                  onCollectionSelect={setActiveCollectionId}
                  onCreateCollection={handleCreateCollection}
                  onDeleteCollection={handleDeleteCollection}
                  onRenameCollection={handleRenameCollection}
                />
              </ModuleContainer>
            </div>
            <div key="library">
              <ModuleContainer title="Music Library" isEditing={isEditing}>
                <MusicLibrary 
                  tracks={tracks} 
                  currentTrack={currentTrack} 
                  onTrackSelect={handleTrackSelect}
                  onAddTracks={handleAddTracks}
                />
              </ModuleContainer>
            </div>
            <div key="playlist">
              <ModuleContainer title="Current Playlist" isEditing={isEditing}>
                <Playlist 
                  tracks={tracks}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onTrackSelect={handleTrackSelect}
                  onRemoveTrack={handleRemoveTrack}
                  onReorder={handleReorder}
                />
              </ModuleContainer>
            </div>
          </ResponsiveGridLayout>
        </MainArea>

        <Toolbar>
          <ToolButton 
            active={isEditing} 
            onClick={() => setIsEditing(!isEditing)}
            title={isEditing ? "Lock Layout" : "Edit Layout"}
          >
            {isEditing ? <Unlock size={20} /> : <LayoutIcon size={20} />}
          </ToolButton>
        </Toolbar>

        <PlayerDetails 
          isVisible={isDetailVisible}
          onClose={() => setIsDetailVisible(false)}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
        />
        
        <ControlPanelWrapper onClick={() => currentTrack && !isEditing && setIsDetailVisible(true)}>
          <PlaybackControls 
            currentTrack={currentTrack}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </ControlPanelWrapper>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
