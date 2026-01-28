import React from 'react';
import styled from 'styled-components';
const { ipcRenderer } = window.require('electron');

const TitleBarContainer = styled.div`
  height: 32px;
  background-color: ${props => props.theme.surface};
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  -webkit-app-region: drag; /* Allows window dragging */
  padding: 0 10px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Title = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

const Controls = styled.div`
  display: flex;
  -webkit-app-region: no-drag; /* Prevents dragging from buttons */
  height: 100%;
`;

const ControlButton = styled.div<{ hoverColor?: string }>`
  width: 46px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  color: ${props => props.theme.text};
  font-size: 14px;

  &:hover {
    background-color: ${props => props.hoverColor || props.theme.surfaceHover};
    ${props => props.hoverColor && 'color: white;'}
  }
`;

const WindowTitleBar: React.FC = () => {
  return (
    <TitleBarContainer>
      <Title>Modular Music Player</Title>
      <Controls>
        <ControlButton onClick={() => ipcRenderer.send('window-minimize')}>
          <span style={{ marginBottom: '8px' }}>—</span>
        </ControlButton>
        <ControlButton onClick={() => ipcRenderer.send('window-maximize')}>
          <span>▢</span>
        </ControlButton>
        <ControlButton 
          hoverColor="#e81123" 
          onClick={() => ipcRenderer.send('window-close')}
        >
          <span>✕</span>
        </ControlButton>
      </Controls>
    </TitleBarContainer>
  );
};

export default WindowTitleBar;
