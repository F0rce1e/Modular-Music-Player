import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { audioService, Track } from '../services/AudioService';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  background-color: ${props => props.theme.surface};
`;

const MainControls = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 8px;
`;

const ControlButton = styled.button<{ primary?: boolean }>`
  background: ${props => props.primary ? props.theme.accent : 'none'};
  border: none;
  color: ${props => props.primary ? 'white' : props.theme.text};
  width: ${props => props.primary ? '40px' : '32px'};
  height: ${props => props.primary ? '40px' : '32px'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.primary ? props.theme.accentHover : props.theme.surfaceHover};
    transform: scale(1.05);
  }

  &:disabled {
    color: ${props => props.theme.textSecondary};
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProgressBar = styled.input`
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: ${props => props.theme.border};
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.theme.accent};
    cursor: pointer;
    transition: transform 0.1s;
  }

  &:hover::-webkit-slider-thumb {
    transform: scale(1.2);
  }
`;

const TimeLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  min-width: 35px;
  font-variant-numeric: tabular-nums;
`;

interface PlaybackControlsProps {
  currentTrack: Track | null;
  onNext?: () => void;
  onPrev?: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ currentTrack, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (audioService.isPlaying()) {
        setProgress(audioService.getSeek());
        setDuration(audioService.getDuration());
      }
    }, 500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsPlaying(audioService.isPlaying());
  }, [currentTrack]);

  const handleTogglePlay = () => {
    if (audioService.isPlaying()) {
      audioService.pause();
      setIsPlaying(false);
    } else if (currentTrack) {
      audioService.play(currentTrack);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioService.seek(val);
    setProgress(val);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ControlsContainer>
      <MainControls>
        <ControlButton onClick={onPrev} disabled={!currentTrack}>
          <SkipBack size={20} fill="currentColor" />
        </ControlButton>
        
        <ControlButton primary onClick={handleTogglePlay} disabled={!currentTrack}>
          {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" style={{ marginLeft: '2px' }} />}
        </ControlButton>

        <ControlButton onClick={onNext} disabled={!currentTrack}>
          <SkipForward size={20} fill="currentColor" />
        </ControlButton>
      </MainControls>

      <ProgressBarContainer>
        <TimeLabel>{formatTime(progress)}</TimeLabel>
        <ProgressBar 
          type="range" 
          min="0" 
          max={duration || 100} 
          value={progress} 
          onChange={handleSeek}
          disabled={!currentTrack}
        />
        <TimeLabel>{formatTime(duration)}</TimeLabel>
      </ProgressBarContainer>
    </ControlsContainer>
  );
};

export default PlaybackControls;
