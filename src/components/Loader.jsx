import SolarLogo from './SolarLogo';

export default function Loader() {
  return (
    <div id="loader" style={{
      position: 'fixed', inset: 0, background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 9999, gap: 24,
    }}>
      <SolarLogo size={150} />
      <p style={{ fontFamily: 'Space Grotesk', color: 'var(--fg-muted)', fontSize: 14, letterSpacing: '0.05em' }}>
        Chargement du tableau de bord...
      </p>
      <div className="loader-ring" />
    </div>
  );
}
