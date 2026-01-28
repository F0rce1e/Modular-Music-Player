import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Heart, ListMusic, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.surface};
`;

const NavSection = styled.div`
  padding: 12px;
`;

const NavItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  color: ${props => props.isActive ? props.theme.accent : props.theme.text};
  background-color: ${props => props.isActive ? props.theme.surfaceHover : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: all 0.2s;
  font-weight: ${props => props.isActive ? '600' : '400'};

  &:hover {
    background-color: ${props => props.theme.surfaceHover};
  }

  svg {
    margin-right: 12px;
  }
`;

const PlaylistSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
`;

const CreateButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.accent};
    background-color: ${props => props.theme.surfaceHover};
  }
`;

const PlaylistItem = styled.div<{ isActive?: boolean }>`
  padding: 8px 12px;
  color: ${props => props.isActive ? props.theme.accent : props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.surfaceHover};
  }

  .actions {
    opacity: 0;
  }

  &:hover .actions {
    opacity: 1;
  }
`;

export interface Collection {
  id: string;
  name: string;
  trackIds: string[];
}

interface SidebarProps {
  collections: Collection[];
  activeCollectionId: string | null;
  onCollectionSelect: (id: string | null) => void;
  onCreateCollection: () => void;
  onDeleteCollection: (id: string) => void;
  onRenameCollection: (id: string, newName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collections,
  activeCollectionId,
  onCollectionSelect,
  onCreateCollection,
  onDeleteCollection,
  onRenameCollection
}) => {
  return (
    <SidebarContainer>
      <NavSection>
        <NavItem 
          isActive={activeCollectionId === null} 
          onClick={() => onCollectionSelect(null)}
        >
          <ListMusic size={18} />
          <span>All Songs</span>
        </NavItem>
        <NavItem 
          isActive={activeCollectionId === 'favorites'} 
          onClick={() => onCollectionSelect('favorites')}
        >
          <Heart size={18} color={activeCollectionId === 'favorites' ? '#ff4d4f' : 'currentColor'} fill={activeCollectionId === 'favorites' ? '#ff4d4f' : 'none'} />
          <span>Favorites</span>
        </NavItem>
      </NavSection>

      <PlaylistSection>
        <SectionHeader>
          <span>Playlists</span>
          <CreateButton onClick={(e) => { e.stopPropagation(); onCreateCollection(); }}>
            <Plus size={16} />
          </CreateButton>
        </SectionHeader>

        {collections.map(collection => (
          <PlaylistItem 
            key={collection.id}
            isActive={activeCollectionId === collection.id}
            onClick={() => onCollectionSelect(collection.id)}
          >
            <span>{collection.name}</span>
            <div className="actions">
              <MoreVertical size={14} />
            </div>
          </PlaylistItem>
        ))}
      </PlaylistSection>
    </SidebarContainer>
  );
};

export default Sidebar;
