import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SlidersHorizontal } from 'lucide-react';
import { audioService } from '../services/AudioService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--module-bg, ${props => props.theme.surface});
  color: var(--module-text, ${props => props.theme.text});
`;

const Header = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Sliders = styled.div<{ $layout: 'wide' | 'compact' | 'narrow' }>`
  flex: 1;
  display: grid;
  grid-template-columns: ${props => props.$layout === 'wide' ? 'repeat(5, 1fr)' : props.$layout === 'compact' ? 'repeat(2, 1fr)' : '1fr'};
  gap: 12px;
  padding: 16px;
`;

const Band = styled.div<{ $vertical: boolean }>`
  display: flex;
  flex-direction: ${props => props.$vertical ? 'row' : 'column'};
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${props => props.theme.textSecondary};
`;

const Slider = styled.input<{ $vertical: boolean }>`
  width: ${props => props.$vertical ? '12px' : '100%'};
  height: ${props => props.$vertical ? '120px' : 'auto'};
  -webkit-appearance: ${props => props.$vertical ? 'slider-vertical' : 'none'};
  writing-mode: ${props => props.$vertical ? 'bt-lr' : 'initial'};
  accent-color: ${props => props.theme.accent};
`;

const Label = styled.div`
  font-size: 0.75rem;
`;

const bands = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];

const Equalizer: React.FC = () => {
  const [values, setValues] = useState<number[]>(() => audioService.getEqualizerValues());
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<'wide' | 'compact' | 'narrow'>('wide');

  useEffect(() => {
    audioService.setEqualizer(values);
  }, [values]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = (width: number) => {
      if (width <= 320) {
        setLayout('narrow');
      } else if (width <= 520) {
        setLayout('compact');
      } else {
        setLayout('wide');
      }
    };
    update(el.clientWidth);
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) update(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleChange = (index: number, value: number) => {
    setValues(prev => prev.map((v, i) => (i === index ? value : v)));
  };

  return (
    <Container ref={containerRef}>
      <Header>
        <SlidersHorizontal size={14} />
        Equalizer
      </Header>
      <Sliders $layout={layout}>
        {bands.map((label, index) => (
          <Band key={label} $vertical={layout !== 'wide'}>
            <Slider
              type="range"
              min={-12}
              max={12}
              step={0.5}
              value={values[index]}
              onChange={(e) => handleChange(index, Number(e.target.value))}
              $vertical={layout !== 'wide'}
            />
            <Label>{label}</Label>
          </Band>
        ))}
      </Sliders>
    </Container>
  );
};

export default Equalizer;
