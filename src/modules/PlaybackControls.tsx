import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { audioService, Track } from '../services/AudioService';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

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

const ProgressBar = styled.input<{ progressPercent: number }>`
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: ${props => `linear-gradient(90deg, ${props.theme.accent} ${props.progressPercent}%, ${props.theme.border} ${props.progressPercent}%)`};
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
  const [isSeeking, setIsSeeking] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isSeeking) return;
      const nextDuration = audioService.getDuration();
      const nextProgress = audioService.getSeek();
      if (nextDuration >= 0) setDuration(nextDuration);
      if (nextProgress >= 0) setProgress(nextProgress);
      setIsPlaying(audioService.isPlaying());
    }, 500);

    return () => clearInterval(timer);
  }, [isSeeking]);

  useEffect(() => {
    setIsPlaying(audioService.isPlaying());
    setProgress(0);
    setDuration(audioService.getDuration());
  }, [currentTrack]);

  const handleTogglePlay = () => {
    if (!currentTrack) return;
    if (audioService.isPlaying()) {
      audioService.pause();
      setIsPlaying(false);
      return;
    }
    audioService.play(currentTrack);
    setIsPlaying(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setDragValue(val);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    setDragValue(progress);
    wasPlayingRef.current = audioService.isPlaying();
    audioService.pause();
  };

  const handleSeekCommit = () => {
    audioService.seek(dragValue);
    setProgress(dragValue);
    setIsSeeking(false);
    if (wasPlayingRef.current) {
      if (currentTrack) {
        audioService.play(currentTrack);
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayProgress = useMemo(() => (isSeeking ? dragValue : progress), [isSeeking, dragValue, progress]);
  const progressPercent = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (displayProgress / duration) * 100));
  }, [displayProgress, duration]);

  const canPrev = Boolean(currentTrack) && Boolean(onPrev);
  const canNext = Boolean(currentTrack) && Boolean(onNext);

  return (
    <ControlsContainer>
      <MainControls>
        <ControlButton onClick={onPrev} disabled={!canPrev}>
          <SkipBack size={20} fill="currentColor" />
        </ControlButton>
        
        <ControlButton primary onClick={handleTogglePlay} disabled={!currentTrack}>
          {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" style={{ marginLeft: '2px' }} />}
        </ControlButton>

        <ControlButton onClick={onNext} disabled={!canNext}>
          <SkipForward size={20} fill="currentColor" />
        </ControlButton>
      </MainControls>

      <ProgressBarContainer>
        <TimeLabel>{formatTime(displayProgress)}</TimeLabel>
        <ProgressBar 
          type="range" 
          min="0" 
          max={duration || 0} 
          value={displayProgress} 
          onChange={handleSeekChange}
          onMouseDown={handleSeekStart}
          onTouchStart={handleSeekStart}
          onMouseUp={handleSeekCommit}
          onTouchEnd={handleSeekCommit}
          disabled={!currentTrack}
          progressPercent={progressPercent}
        />
        <TimeLabel>{formatTime(duration)}</TimeLabel>
      </ProgressBarContainer>
    </ControlsContainer>
  );
};

export default PlaybackControls;
