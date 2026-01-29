import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Responsive, type Layout, type ResponsiveLayouts, type LayoutItem } from 'react-grid-layout';
import { WidthProvider } from 'react-grid-layout/legacy';
import { audioService, Track } from './services/AudioService';
import MusicLibrary from './modules/MusicLibrary';
import PlaybackControls from './modules/PlaybackControls';
import Playlist from './modules/Playlist';
import Sidebar, { Collection } from './modules/Sidebar';
import PlayerDetails from './modules/PlayerDetails';
import NowPlaying from './modules/NowPlaying';
import RecentPlays from './modules/RecentPlays';
import Favorites from './modules/Favorites';
import Equalizer from './modules/Equalizer';
import LibraryStats from './modules/LibraryStats';
import WindowTitleBar from './components/WindowTitleBar';
import ModuleContainer from './components/ModuleContainer';
import { lightTheme } from './styles/theme';
import { Layout as LayoutIcon, Unlock, Settings } from 'lucide-react';

const ResponsiveGridLayout = WidthProvider(Responsive);

type Breakpoint = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';

interface ModuleConfig {
  id: string;
  title: string;
  isVisible: boolean;
}

const breakpoints: Record<Breakpoint, number> = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0
};

const cols: Record<Breakpoint, number> = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2
};

const moduleOrder = ['sidebar', 'library', 'playlist', 'nowPlaying', 'recent', 'favorites', 'equalizer', 'stats'] as const;
type ModuleId = typeof moduleOrder[number];

const defaultModuleLayouts: Record<ModuleId, Record<Breakpoint, LayoutItem>> = {
  sidebar: {
    lg: { i: 'sidebar', x: 0, y: 0, w: 2, h: 10, minW: 2, minH: 6 },
    md: { i: 'sidebar', x: 0, y: 0, w: 2, h: 10, minW: 2, minH: 6 },
    sm: { i: 'sidebar', x: 0, y: 0, w: 2, h: 10, minW: 2, minH: 6 },
    xs: { i: 'sidebar', x: 0, y: 0, w: 4, h: 10, minW: 2, minH: 6 },
    xxs: { i: 'sidebar', x: 0, y: 0, w: 2, h: 10, minW: 2, minH: 6 }
  },
  library: {
    lg: { i: 'library', x: 2, y: 0, w: 7, h: 10, minW: 3, minH: 6 },
    md: { i: 'library', x: 2, y: 0, w: 6, h: 10, minW: 3, minH: 6 },
    sm: { i: 'library', x: 2, y: 0, w: 4, h: 10, minW: 3, minH: 6 },
    xs: { i: 'library', x: 0, y: 10, w: 4, h: 10, minW: 2, minH: 6 },
    xxs: { i: 'library', x: 0, y: 10, w: 2, h: 10, minW: 2, minH: 6 }
  },
  playlist: {
    lg: { i: 'playlist', x: 9, y: 0, w: 3, h: 10, minW: 2, minH: 6 },
    md: { i: 'playlist', x: 8, y: 0, w: 2, h: 10, minW: 2, minH: 6 },
    sm: { i: 'playlist', x: 0, y: 10, w: 6, h: 10, minW: 3, minH: 6 },
    xs: { i: 'playlist', x: 0, y: 20, w: 4, h: 10, minW: 2, minH: 6 },
    xxs: { i: 'playlist', x: 0, y: 20, w: 2, h: 10, minW: 2, minH: 6 }
  },
  nowPlaying: {
    lg: { i: 'nowPlaying', x: 0, y: 10, w: 5, h: 5, minW: 3, minH: 4 },
    md: { i: 'nowPlaying', x: 0, y: 10, w: 5, h: 5, minW: 3, minH: 4 },
    sm: { i: 'nowPlaying', x: 0, y: 20, w: 6, h: 4, minW: 3, minH: 4 },
    xs: { i: 'nowPlaying', x: 0, y: 30, w: 4, h: 4, minW: 2, minH: 4 },
    xxs: { i: 'nowPlaying', x: 0, y: 30, w: 2, h: 4, minW: 2, minH: 4 }
  },
  recent: {
    lg: { i: 'recent', x: 5, y: 10, w: 4, h: 5, minW: 3, minH: 4 },
    md: { i: 'recent', x: 5, y: 10, w: 3, h: 5, minW: 3, minH: 4 },
    sm: { i: 'recent', x: 0, y: 24, w: 6, h: 4, minW: 3, minH: 4 },
    xs: { i: 'recent', x: 0, y: 34, w: 4, h: 4, minW: 2, minH: 4 },
    xxs: { i: 'recent', x: 0, y: 34, w: 2, h: 4, minW: 2, minH: 4 }
  },
  favorites: {
    lg: { i: 'favorites', x: 9, y: 10, w: 3, h: 5, minW: 2, minH: 4 },
    md: { i: 'favorites', x: 8, y: 10, w: 2, h: 5, minW: 2, minH: 4 },
    sm: { i: 'favorites', x: 0, y: 28, w: 6, h: 4, minW: 3, minH: 4 },
    xs: { i: 'favorites', x: 0, y: 38, w: 4, h: 4, minW: 2, minH: 4 },
    xxs: { i: 'favorites', x: 0, y: 38, w: 2, h: 4, minW: 2, minH: 4 }
  },
  equalizer: {
    lg: { i: 'equalizer', x: 0, y: 15, w: 7, h: 5, minW: 4, minH: 4 },
    md: { i: 'equalizer', x: 0, y: 15, w: 6, h: 5, minW: 4, minH: 4 },
    sm: { i: 'equalizer', x: 0, y: 32, w: 6, h: 4, minW: 3, minH: 4 },
    xs: { i: 'equalizer', x: 0, y: 42, w: 4, h: 4, minW: 2, minH: 4 },
    xxs: { i: 'equalizer', x: 0, y: 42, w: 2, h: 4, minW: 2, minH: 4 }
  },
  stats: {
    lg: { i: 'stats', x: 7, y: 15, w: 5, h: 5, minW: 3, minH: 4 },
    md: { i: 'stats', x: 6, y: 15, w: 4, h: 5, minW: 3, minH: 4 },
    sm: { i: 'stats', x: 0, y: 36, w: 6, h: 4, minW: 3, minH: 4 },
    xs: { i: 'stats', x: 0, y: 46, w: 4, h: 4, minW: 2, minH: 4 },
    xxs: { i: 'stats', x: 0, y: 46, w: 2, h: 4, minW: 2, minH: 4 }
  }
};

const moduleMeta = [
  { id: 'sidebar', title: 'Navigator', defaultLayouts: defaultModuleLayouts.sidebar },
  { id: 'library', title: 'Music Library', defaultLayouts: defaultModuleLayouts.library },
  { id: 'playlist', title: 'Current Playlist', defaultLayouts: defaultModuleLayouts.playlist },
  { id: 'nowPlaying', title: 'Now Playing', defaultLayouts: defaultModuleLayouts.nowPlaying },
  { id: 'recent', title: 'Recent Plays', defaultLayouts: defaultModuleLayouts.recent },
  { id: 'favorites', title: 'Favorites', defaultLayouts: defaultModuleLayouts.favorites },
  { id: 'equalizer', title: 'Equalizer', defaultLayouts: defaultModuleLayouts.equalizer },
  { id: 'stats', title: 'Library Stats', defaultLayouts: defaultModuleLayouts.stats }
];

const buildDefaultLayouts = (): ResponsiveLayouts<string> => ({
  lg: moduleOrder.map(id => defaultModuleLayouts[id].lg),
  md: moduleOrder.map(id => defaultModuleLayouts[id].md),
  sm: moduleOrder.map(id => defaultModuleLayouts[id].sm),
  xs: moduleOrder.map(id => defaultModuleLayouts[id].xs),
  xxs: moduleOrder.map(id => defaultModuleLayouts[id].xxs)
});

const defaultLayouts = buildDefaultLayouts();

const mergeModuleConfigs = (saved: ModuleConfig[] | null): ModuleConfig[] => {
  const savedMap = new Map(saved?.map(config => [config.id, config]) ?? []);
  return moduleMeta.map(meta => ({
    id: meta.id,
    title: savedMap.get(meta.id)?.title ?? meta.title,
    isVisible: savedMap.get(meta.id)?.isVisible ?? true
  }));
};

const normalizeLayouts = (
  inputLayouts: ResponsiveLayouts<string>,
  configs: ModuleConfig[]
): ResponsiveLayouts<string> => {
  const configMap = new Map(configs.map(config => [config.id, config]));
  const visibleIds = configs.filter(config => config.isVisible).map(config => config.id);
  const metaMap = new Map(moduleMeta.map(meta => [meta.id, meta]));
  const normalized: ResponsiveLayouts<string> = {};
  (Object.keys(breakpoints) as Breakpoint[]).forEach(bp => {
    const base = inputLayouts[bp] ?? defaultLayouts[bp] ?? [];
    const filtered = base.filter(item => configMap.get(item.i)?.isVisible);
    const completed = [...filtered];
    visibleIds.forEach(id => {
      if (!completed.some(item => item.i === id)) {
        const meta = metaMap.get(id);
        if (meta) {
          completed.push(meta.defaultLayouts[bp]);
        }
      }
    });
    normalized[bp] = completed;
  });
  return normalized;
};

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

const ModuleManagerPanel = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 320px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  overflow: hidden;
  z-index: 1000;
`;

const ModuleManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ModuleManagerTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.text};
`;

const ModuleManagerBody = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModuleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ModuleToggle = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.accent};
  cursor: pointer;
`;

const ModuleTitleInput = styled.input`
  flex: 1;
  background: ${props => props.theme.surfaceHover};
  border: 1px solid ${props => props.theme.border};
  border-radius: 10px;
  padding: 6px 10px;
  color: ${props => props.theme.text};
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.accent};
    background: ${props => props.theme.surface};
  }
`;

const ModuleManagerActions = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 16px 16px 16px;
`;

const ActionButton = styled.button`
  flex: 1;
  background: ${props => props.theme.surfaceHover};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 8px 10px;
  font-size: 0.8rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.surface};
    border-color: ${props => props.theme.accent};
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

const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModuleManagerOpen, setIsModuleManagerOpen] = useState(false);
  const [moduleConfigs, setModuleConfigs] = useState<ModuleConfig[]>(() => mergeModuleConfigs(null));
  const [layouts, setLayouts] = useState<ResponsiveLayouts<string>>(defaultLayouts);
  const [favoriteTrackIds, setFavoriteTrackIds] = useState<string[]>([]);
  const [recentTrackIds, setRecentTrackIds] = useState<string[]>([]);

  useEffect(() => {
    const savedConfigs = localStorage.getItem('player-modules');
    const savedLayouts = localStorage.getItem('player-layouts');
    const savedFavorites = localStorage.getItem('player-favorites');
    const savedRecents = localStorage.getItem('player-recents');
    const parsedConfigs = savedConfigs ? (JSON.parse(savedConfigs) as ModuleConfig[]) : null;
    const nextConfigs = mergeModuleConfigs(parsedConfigs);
    const parsedLayouts = savedLayouts ? (JSON.parse(savedLayouts) as ResponsiveLayouts<string>) : defaultLayouts;
    const normalized = normalizeLayouts(parsedLayouts, nextConfigs);
    const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    const parsedRecents = savedRecents ? JSON.parse(savedRecents) : [];
    setModuleConfigs(nextConfigs);
    setLayouts(normalized);
    setFavoriteTrackIds(Array.isArray(parsedFavorites) ? parsedFavorites : []);
    setRecentTrackIds(Array.isArray(parsedRecents) ? parsedRecents : []);
  }, []);

  useEffect(() => {
    localStorage.setItem('player-modules', JSON.stringify(moduleConfigs));
  }, [moduleConfigs]);

  useEffect(() => {
    localStorage.setItem('player-favorites', JSON.stringify(favoriteTrackIds));
  }, [favoriteTrackIds]);

  useEffect(() => {
    localStorage.setItem('player-recents', JSON.stringify(recentTrackIds));
  }, [recentTrackIds]);

  useEffect(() => {
    setFavoriteTrackIds(prev => prev.filter(id => tracks.some(track => track.id === id)));
    setRecentTrackIds(prev => prev.filter(id => tracks.some(track => track.id === id)));
  }, [tracks]);

  useEffect(() => {
    if (!isEditing) {
      setIsModuleManagerOpen(false);
    }
  }, [isEditing]);

  const onLayoutChange = (currentLayout: Layout, allLayouts: ResponsiveLayouts<string>) => {
    const normalized = normalizeLayouts(allLayouts, moduleConfigs);
    setLayouts(normalized);
    localStorage.setItem('player-layouts', JSON.stringify(normalized));
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    audioService.play(track);
    setIsPlaying(true);
    setRecentTrackIds(prev => {
      const next = [track.id, ...prev.filter(id => id !== track.id)];
      return next.slice(0, 20);
    });
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
    setFavoriteTrackIds(prev => prev.filter(id => id !== trackId));
    setRecentTrackIds(prev => prev.filter(id => id !== trackId));
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

  const handleToggleFavorite = () => {
    if (!currentTrack) return;
    setFavoriteTrackIds(prev => (
      prev.includes(currentTrack.id)
        ? prev.filter(id => id !== currentTrack.id)
        : [currentTrack.id, ...prev]
    ));
  };

  const handleToggleModule = (id: string) => {
    setModuleConfigs(prev => {
      const updated = prev.map(config => 
        config.id === id ? { ...config, isVisible: !config.isVisible } : config
      );
      setLayouts(prevLayouts => normalizeLayouts(prevLayouts, updated));
      return updated;
    });
  };

  const handleRenameModule = (id: string, title: string) => {
    setModuleConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, title } : config
    ));
  };

  const handleResetLayout = () => {
    const normalized = normalizeLayouts(defaultLayouts, moduleConfigs);
    setLayouts(normalized);
    localStorage.setItem('player-layouts', JSON.stringify(normalized));
  };

  const handleResetModules = () => {
    const nextConfigs = mergeModuleConfigs(null);
    const normalized = normalizeLayouts(defaultLayouts, nextConfigs);
    setModuleConfigs(nextConfigs);
    setLayouts(normalized);
    localStorage.setItem('player-layouts', JSON.stringify(normalized));
  };

  const moduleConfigMap = new Map(moduleConfigs.map(config => [config.id, config]));
  const favoriteTracks = tracks.filter(track => favoriteTrackIds.includes(track.id));
  const recentTracks = recentTrackIds
    .map(id => tracks.find(track => track.id === id))
    .filter((track): track is Track => Boolean(track));
  const isCurrentFavorite = currentTrack ? favoriteTrackIds.includes(currentTrack.id) : false;
  const moduleDefinitions = [
    {
      id: 'sidebar',
      title: 'Navigator',
      render: () => (
        <Sidebar
          collections={collections}
          activeCollectionId={activeCollectionId}
          onCollectionSelect={setActiveCollectionId}
          onCreateCollection={handleCreateCollection}
          onDeleteCollection={handleDeleteCollection}
          onRenameCollection={handleRenameCollection}
        />
      )
    },
    {
      id: 'library',
      title: 'Music Library',
      render: () => (
        <MusicLibrary
          tracks={tracks}
          currentTrack={currentTrack}
          onTrackSelect={handleTrackSelect}
          onAddTracks={handleAddTracks}
        />
      )
    },
    {
      id: 'playlist',
      title: 'Current Playlist',
      render: () => (
        <Playlist
          tracks={tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTrackSelect={handleTrackSelect}
          onRemoveTrack={handleRemoveTrack}
          onReorder={handleReorder}
        />
      )
    },
    {
      id: 'nowPlaying',
      title: 'Now Playing',
      render: () => (
        <NowPlaying
          currentTrack={currentTrack}
          isPlaying={isPlaying}
        />
      )
    },
    {
      id: 'recent',
      title: 'Recent Plays',
      render: () => (
        <RecentPlays
          recentTracks={recentTracks}
          currentTrack={currentTrack}
          onTrackSelect={handleTrackSelect}
        />
      )
    },
    {
      id: 'favorites',
      title: 'Favorites',
      render: () => (
        <Favorites
          favorites={favoriteTracks}
          currentTrack={currentTrack}
          isFavorite={isCurrentFavorite}
          onToggleFavorite={handleToggleFavorite}
          onTrackSelect={handleTrackSelect}
        />
      )
    },
    {
      id: 'equalizer',
      title: 'Equalizer',
      render: () => <Equalizer />
    },
    {
      id: 'stats',
      title: 'Library Stats',
      render: () => (
        <LibraryStats
          trackCount={tracks.length}
          playlistCount={collections.length}
          favoriteCount={favoriteTracks.length}
          recentCount={recentTracks.length}
        />
      )
    }
  ];

  const visibleModules = moduleDefinitions.filter(definition => moduleConfigMap.get(definition.id)?.isVisible);

  return (
    <ThemeProvider theme={lightTheme}>
      <AppContainer>
        <GlobalStyle />
        <WindowTitleBar />
        
        <MainArea>
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={60}
            dragConfig={{ enabled: isEditing, handle: '.drag-handle' }}
            resizeConfig={{ enabled: isEditing }}
            onLayoutChange={onLayoutChange}
            margin={[12, 12]}
          >
            {visibleModules.map(module => {
              const config = moduleConfigMap.get(module.id);
              return (
                <div key={module.id}>
                  <ModuleContainer
                    title={config?.title ?? module.title}
                    isEditing={isEditing}
                    onClose={() => handleToggleModule(module.id)}
                  >
                    {module.render()}
                  </ModuleContainer>
                </div>
              );
            })}
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
          <ToolButton
            active={isModuleManagerOpen}
            onClick={() => {
              if (!isEditing) setIsEditing(true);
              setIsModuleManagerOpen(prev => !prev);
            }}
            title="Module Manager"
          >
            <Settings size={20} />
          </ToolButton>
        </Toolbar>

        {isEditing && isModuleManagerOpen && (
          <ModuleManagerPanel>
            <ModuleManagerHeader>
              <ModuleManagerTitle>Module Manager</ModuleManagerTitle>
              <Settings size={16} />
            </ModuleManagerHeader>
            <ModuleManagerBody>
              {moduleDefinitions.map(module => {
                const config = moduleConfigMap.get(module.id);
                const isVisible = config?.isVisible ?? true;
                return (
                  <ModuleRow key={module.id}>
                    <ModuleToggle
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => handleToggleModule(module.id)}
                    />
                    <ModuleTitleInput
                      value={config?.title ?? module.title}
                      onChange={(e) => handleRenameModule(module.id, e.target.value)}
                    />
                  </ModuleRow>
                );
              })}
            </ModuleManagerBody>
            <ModuleManagerActions>
              <ActionButton onClick={handleResetLayout}>Reset Layout</ActionButton>
              <ActionButton onClick={handleResetModules}>Reset Modules</ActionButton>
            </ModuleManagerActions>
          </ModuleManagerPanel>
        )}

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
