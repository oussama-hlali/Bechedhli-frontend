import bechedhliLogo from '../assets/bechedhli-logo.png';

export default function SolarLogo({ size = 180 }) {
  return (
    <img 
      src={bechedhliLogo} 
      alt="Bechedhli Solar Energy" 
      style={{ width: size, height: 'auto' }}
    />
  );
}
