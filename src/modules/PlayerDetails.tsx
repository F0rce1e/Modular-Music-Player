import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Track, audioService } from '../services/AudioService';
import { ChevronDown, Music, Disc } from 'lucide-react';

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const DetailContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 32px; /* Below title bar */
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.background};
  z-index: 1000;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  flex-direction: column;
  animation: ${slideUp} 0.3s ease-out;
  padding: 40px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.text};
    background-color: ${props => props.theme.surfaceHover};
    transform: translateY(-2px);
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const AlbumArtWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
`;

const AlbumArt = styled.div<{ isPlaying: boolean }>`
  width: 320px;
  height: 320px;
  background-color: ${props => props.theme.surfaceHover};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadow};
  position: relative;
  animation: ${rotate} 20s linear infinite;
  animation-play-state: ${props => props.isPlaying ? 'running' : 'paused'};
  border: 8px solid ${props => props.theme.surface};

  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    background-color: ${props => props.theme.background};
    border-radius: 50%;
    border: 8px solid ${props => props.theme.surface};
  }
`;

const TrackInfo = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 8px;
  color: ${props => props.theme.text};
`;

const Artist = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 400;
  margin: 0;
`;

const LyricsWrapper = styled.div`
  flex: 1;
  height: 80%;
  overflow-y: auto;
  padding: 40px;
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  text-align: center;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const LyricLine = styled.p<{ active?: boolean }>`
  font-size: ${props => props.active ? '1.8rem' : '1.2rem'};
  color: ${props => props.active ? '#fff' : '#555'};
  margin: 20px 0;
  transition: all 0.3s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

interface PlayerDetailsProps {
  isVisible: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({ 
  isVisible, 
  onClose, 
  currentTrack,
  isPlaying
}) => {
  // Mock lyrics for now
  const lyrics = [
    "Searching for the rhythm...",
    "Music in my soul",
    "Dancing in the moonlight",
    "Feeling in control",
    "Every beat is magic",
    "Every sound is gold",
    "The story of a lifetime",
    "Waiting to be told"
  ];

  const [activeLyricIndex, setActiveLyricIndex] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveLyricIndex(prev => (prev + 1) % lyrics.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  if (!currentTrack) return null;

  return (
    <DetailContainer isVisible={isVisible}>
      <CloseButton onClick={onClose}>
        <ChevronDown size={32} />
      </CloseButton>
      
      <Content>
        <AlbumArtWrapper>
          <AlbumArt isPlaying={isPlaying}>
            <Disc size={200} color="#121212" />
          </AlbumArt>
          <TrackInfo>
            <Title>{currentTrack.title}</Title>
            <Artist>{currentTrack.artist || 'Unknown Artist'}</Artist>
          </TrackInfo>
        </AlbumArtWrapper>

        <LyricsWrapper>
          {lyrics.map((line, index) => (
            <LyricLine key={index} active={index === activeLyricIndex}>
              {line}
            </LyricLine>
          ))}
        </LyricsWrapper>
      </Content>
    </DetailContainer>
  );
};

export default PlayerDetails;
