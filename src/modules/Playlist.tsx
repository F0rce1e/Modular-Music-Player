import React from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Track } from '../services/AudioService';
import { Play, Pause, Trash2, GripVertical } from 'lucide-react';

const PlaylistContainer = styled.div`
  background-color: ${props => props.theme.surface};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: ${props => props.theme.text};
`;

const ListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 3px;
  }
`;

const TrackItem = styled.div<{ isActive: boolean; isDragging: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 4px;
  background-color: ${props => props.isDragging ? props.theme.surfaceHover : props.isActive ? props.theme.surfaceHover : 'transparent'};
  border-radius: 8px;
  transition: background-color 0.2s;
  user-select: none;

  &:hover {
    background-color: ${props => props.theme.surfaceHover};
  }
`;

const GripHandle = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textSecondary};
  margin-right: 8px;
  cursor: grab;
`;

const TrackInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
`;

const TrackName = styled.span<{ isActive: boolean }>`
  font-size: 0.9rem;
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
  color: ${props => props.isActive ? props.theme.accent : props.theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  ${TrackItem}:hover & {
    opacity: 1;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.text};
    background-color: ${props => props.theme.surfaceHover};
  }
`;

interface PlaylistProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onRemoveTrack: (trackId: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ 
  tracks, 
  currentTrack, 
  isPlaying, 
  onTrackSelect, 
  onRemoveTrack,
  onReorder
}) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <PlaylistContainer>
      <Header>
        <Title>Play Queue</Title>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>{tracks.length} tracks</span>
      </Header>
      <ListWrapper>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tracks.map((track, index) => (
                  <Draggable key={track.id} draggableId={track.id} index={index}>
                    {(provided, snapshot) => (
                      <TrackItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        isActive={currentTrack?.id === track.id}
                        isDragging={snapshot.isDragging}
                      >
                        <GripHandle {...provided.dragHandleProps}>
                          <GripVertical size={16} />
                        </GripHandle>
                        <TrackInfo onClick={() => onTrackSelect(track)}>
                          <TrackName isActive={currentTrack?.id === track.id}>
                            {track.title}
                          </TrackName>
                          <TrackArtist>{track.artist || 'Unknown Artist'}</TrackArtist>
                        </TrackInfo>
                        <Actions>
                          <IconButton onClick={() => onRemoveTrack(track.id)}>
                            <Trash2 size={14} />
                          </IconButton>
                        </Actions>
                      </TrackItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ListWrapper>
    </PlaylistContainer>
  );
};

export default Playlist;
