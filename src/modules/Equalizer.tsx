import React from 'react';
import styled from 'styled-components';
import { SlidersHorizontal } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.surface};
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

const Sliders = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 16px;
`;

const Band = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.textSecondary};
`;

const Slider = styled.input`
  width: 100%;
  accent-color: ${props => props.theme.accent};
`;

const Label = styled.div`
  font-size: 0.75rem;
`;

const bands = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];

const Equalizer: React.FC = () => {
  const [values, setValues] = React.useState<number[]>([0, 0, 0, 0, 0]);

  const handleChange = (index: number, value: number) => {
    setValues(prev => prev.map((v, i) => (i === index ? value : v)));
  };

  return (
    <Container>
      <Header>
        <SlidersHorizontal size={14} />
        Equalizer
      </Header>
      <Sliders>
        {bands.map((label, index) => (
          <Band key={label}>
            <Slider
              type="range"
              min={-12}
              max={12}
              value={values[index]}
              onChange={(e) => handleChange(index, Number(e.target.value))}
            />
            <Label>{label}</Label>
          </Band>
        ))}
      </Sliders>
    </Container>
  );
};

export default Equalizer;
