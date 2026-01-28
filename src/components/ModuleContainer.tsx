import React from 'react';
import styled from 'styled-components';
import { Settings, X, GripHorizontal } from 'lucide-react';

const Container = styled.div<{ isEditing: boolean }>`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  border: 1px solid ${props => props.isEditing ? props.theme.accent : 'transparent'};
  transition: border 0.2s ease;
  position: relative;
`;

const ModuleHeader = styled.div<{ isEditing: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${props => props.isEditing ? props.theme.surfaceHover : 'transparent'};
  border-bottom: 1px solid ${props => props.isEditing ? props.theme.border : 'transparent'};
  cursor: ${props => props.isEditing ? 'grab' : 'default'};
  user-select: none;

  .title {
    font-size: 0.8rem;
    font-weight: 600;
    color: ${props => props.theme.textSecondary};
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .actions {
    display: flex;
    gap: 8px;
    opacity: ${props => props.isEditing ? 1 : 0};
    transition: opacity 0.2s;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textSecondary};
`;

interface ModuleContainerProps {
  title: string;
  children: React.ReactNode;
  isEditing: boolean;
  onClose?: () => void;
  onSettings?: () => void;
  className?: string; // For react-grid-layout
  style?: React.CSSProperties; // For react-grid-layout
}

const ModuleContainer: React.FC<ModuleContainerProps> = ({
  title,
  children,
  isEditing,
  onClose,
  onSettings,
  className,
  style
}) => {
  return (
    <Container isEditing={isEditing} className={className} style={style}>
      {isEditing && (
        <ModuleHeader isEditing={isEditing} className="drag-handle">
          <div className="title">
            <DragHandle>
              <GripHorizontal size={14} />
            </DragHandle>
            {title}
          </div>
          <div className="actions">
            {onSettings && (
              <Settings 
                size={14} 
                cursor="pointer" 
                onClick={(e) => { e.stopPropagation(); onSettings(); }}
              />
            )}
            {onClose && (
              <X 
                size={14} 
                cursor="pointer" 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
              />
            )}
          </div>
        </ModuleHeader>
      )}
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default ModuleContainer;
