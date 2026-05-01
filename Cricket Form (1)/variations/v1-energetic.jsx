// V1 — Energetic Match (closely follows the reference, refined)
const V1 = ({ width = 414, isDesktop = false }) => {
  const acc = {
    yellow: '#F5B82E',
    red: '#E11D2A',
    ink: '#101010',
    paper: '#F4EFE6',
    line: '#1A1A1A',
  };

  const TopBar = (
    <div style={{
      background: acc.yellow,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isDesktop ? '14px 28px' : '10px 14px',
      borderBottom: `2px solid ${acc.ink}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: isDesktop ? 36 : 28, height: isDesktop ? 36 : 28,
          background: acc.ink, borderRadius: '50%',
          display: 'grid', placeItems: 'center', color: acc.yellow,
          fontFamily: 'Anton, sans-serif', fontSize: isDesktop ? 18 : 14, letterSpacing: 0.5,
        }}>APL</div>
        <div style={{
          fontFamily: 'Anton, sans-serif', letterSpacing: 2,
          fontSize: isDesktop ? 18 : 11, color: acc.ink,
        }}>AKSHAR PREMIER LEAGUE · SEASON 3</div>
      </div>
      <button style={{
        background: acc.red, color: '#fff', border: 'none',
        padding: isDesktop ? '10px 18px' : '6px 12px',
        fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: isDesktop ? 13 : 10,
        letterSpacing: 0.6, cursor: 'pointer',
        boxShadow: `3px 3px 0 ${acc.ink}`,
      }}>REGISTER NOW</button>
    </div>
  );

  const Hero = (
    <div style={{
      background: acc.ink, color: '#fff',
      padding: isDesktop ? '56px 56px 64px' : '32px 18px 36px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* gritty grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div style={{
        display: 'inline-block', background: acc.yellow, color: acc.ink,
        padding: '4px 10px', fontFamily: 'Anton, sans-serif',
        fontSize: isDesktop ? 14 : 11, letterSpacing: 1.5,
        position: 'relative',
      }}>APL · SEASON 3</div>
      <h1 style={{
        fontFamily: 'Anton, sans-serif', margin: '14px 0 0',
        fontSize: isDesktop ? 96 : 36,
        lineHeight: 0.95, letterSpacing: 0.5,
        textTransform: 'uppercase', position: 'relative',
      }}>
        Where Cricket<br />Meets <span style={{ color: acc.yellow }}>Character</span>
      </h1>
      <div style={{
        marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap',
        fontFamily: 'JetBrains Mono, monospace', fontSize: isDesktop ? 12 : 10,
        color: 'rgba(255,255,255,0.7)', letterSpacing: 1,
      }}>
        <span>4 PILLARS</span><span>·</span>
        <span>12 TEAMS</span><span>·</span>
        <span>1 PURPOSE</span>
      </div>
    </div>
  );

  const HeroPhoto = (
    <div style={{ position: 'relative', background: acc.ink }}>
      <img src="assets/team-celebration.png" alt="" style={{
        width: '100%', height: isDesktop ? 460 : 220, objectFit: 'cover', display: 'block',
        objectPosition: 'center 35%',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: 80, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
      }} />
      <div style={{
        position: 'absolute', left: isDesktop ? 28 : 14, bottom: isDesktop ? 18 : 12,
        color: '#fff', fontFamily: 'JetBrains Mono, monospace',
        fontSize: isDesktop ? 12 : 10, letterSpacing: 1.5, textTransform: 'uppercase',
      }}>S3 · OPENING DAY · 64 PLAYERS</div>
    </div>
  );

  const About = (
    <div style={{ background: acc.paper, padding: isDesktop ? '48px 56px' : '28px 18px', borderBottom: `1px dashed ${acc.ink}` }}>
      <div style={{
        display: isDesktop ? 'grid' : 'block',
        gridTemplateColumns: '180px 1fr', gap: 40, alignItems: 'start',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isDesktop ? 0 : 14 }}>
          <div style={{
            width: 22, height: 22, background: acc.red,
            display: 'grid', placeItems: 'center', color: '#fff',
            fontFamily: 'Anton, sans-serif', fontSize: 12,
          }}>i</div>
          <span style={{
            fontFamily: 'Anton, sans-serif', letterSpacing: 1.5,
            fontSize: isDesktop ? 16 : 12, color: acc.ink,
          }}>ABOUT THE LEAGUE</span>
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isDesktop ? 20 : 14, lineHeight: 1.55, color: '#202020',
          margin: 0, textWrap: 'pretty',
        }}>
          APL is about <b>brotherhood</b>, <b>Atmiyata</b>, values, discipline, surrender, prayer,
          sportsmanship, and spiritual growth through cricket. The emotional core is not winning trophies —
          but building character, friendships, and divine connection.
        </p>
      </div>
    </div>
  );

  const ExperienceTitle = (
    <div style={{ background: acc.paper, textAlign: 'center', padding: isDesktop ? '40px 28px 24px' : '28px 18px 14px' }}>
      <h2 style={{
        margin: 0, fontFamily: 'Anton, sans-serif',
        fontSize: isDesktop ? 84 : 38, letterSpacing: 1,
        textTransform: 'uppercase', lineHeight: 1,
      }}>
        THE <span style={{ color: acc.red }}>APL</span> <span style={{ color: acc.yellow, WebkitTextStroke: `1px ${acc.ink}` }}>EXPERIENCE</span>
      </h2>
      <div style={{
        marginTop: 8, fontFamily: 'JetBrains Mono, monospace',
        fontSize: isDesktop ? 12 : 10, letterSpacing: 2, color: '#666',
      }}>FOUR PILLARS · ONE FAMILY</div>
    </div>
  );

  const PillarCard = ({ src, label, badge, large, pos }) => (
    <div style={{
      position: 'relative', overflow: 'hidden',
      border: `2px solid ${acc.ink}`, background: acc.ink,
      gridColumn: large ? 'span 2' : 'auto',
      aspectRatio: large ? '1.5/1' : '1/1',
    }}>
      <img src={src} alt="" style={{
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        objectPosition: pos || 'center',
      }} />
      <div style={{
        position: 'absolute', top: 8, right: 8,
        background: acc.yellow, color: acc.ink,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        padding: '2px 6px', letterSpacing: 1,
      }}>{badge}</div>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: isDesktop ? '14px 16px' : '10px 12px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        color: '#fff', fontFamily: 'Anton, sans-serif',
        fontSize: isDesktop ? (large ? 36 : 22) : 16,
        letterSpacing: 2, textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );

  const Pillars = (
    <div style={{ background: acc.paper, padding: isDesktop ? '8px 56px 56px' : '8px 14px 28px' }}>
      <div style={{
        display: 'grid', gap: isDesktop ? 14 : 8,
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}>
        <PillarCard src="assets/blessing-altar.png" label="Blessings" badge="01" large pos="center" />
        <PillarCard src="assets/team-celebration.png" label="Brotherhood" badge="02" large pos="center 30%" />
        <PillarCard src="assets/prayer-line.png" label="Prayer" badge="03" pos="center 30%" />
        <PillarCard src="assets/banyan-group.png" label="Growth" badge="04" pos="center 30%" />
      </div>
    </div>
  );

  const Stats = (
    <div style={{
      background: acc.ink, color: '#fff',
      padding: isDesktop ? '36px 56px' : '24px 18px',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: isDesktop ? 24 : 8,
      borderTop: `4px solid ${acc.yellow}`,
    }}>
      {[
        ['64', 'PLAYERS'],
        ['12', 'TEAMS'],
        ['28', 'MATCHES'],
        ['01', 'PURPOSE'],
      ].map(([n, l]) => (
        <div key={l} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: isDesktop ? 56 : 28,
            color: acc.yellow, lineHeight: 1,
          }}>{n}</div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isDesktop ? 11 : 8, letterSpacing: 1.5,
            marginTop: 4, color: 'rgba(255,255,255,0.7)',
          }}>{l}</div>
        </div>
      ))}
    </div>
  );

  const ClosingCTA = (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: `linear-gradient(105deg, #1B5BD9 0%, #1B5BD9 48%, ${acc.red} 52%, #B11220 100%)`,
      padding: isDesktop ? '54px 56px' : '32px 18px',
      display: 'grid', gridTemplateColumns: isDesktop ? '1.4fr 1fr' : '1fr',
      gap: isDesktop ? 24 : 16, alignItems: 'center',
    }}>
      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.85)',
          fontSize: isDesktop ? 12 : 10, letterSpacing: 2, marginBottom: 10,
        }}>S3 · OPENING JUNE 14</div>
        <h3 style={{
          margin: 0, color: '#fff', fontFamily: 'Anton, sans-serif',
          fontSize: isDesktop ? 64 : 30, lineHeight: 0.95,
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>Season 3<br />is calling</h3>
        <button style={{
          marginTop: 18, background: '#fff', color: acc.ink,
          border: 'none', padding: isDesktop ? '14px 22px' : '10px 16px',
          fontFamily: 'Anton, sans-serif', fontSize: isDesktop ? 16 : 13,
          letterSpacing: 1.5, cursor: 'pointer',
          boxShadow: `4px 4px 0 ${acc.ink}`,
        }}>REGISTER NOW →</button>
      </div>
      <div style={{
        position: 'relative', height: isDesktop ? 220 : 140,
        border: `3px solid #fff`, overflow: 'hidden',
      }}>
        <img src="assets/five-batsmen.png" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%',
        }} />
      </div>
    </div>
  );

  const Footer = (
    <div style={{
      background: acc.ink, color: 'rgba(255,255,255,0.6)',
      padding: isDesktop ? '20px 56px' : '14px 18px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: isDesktop ? 11 : 9, letterSpacing: 1.5,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 8,
    }}>
      <span>© AKSHAR PREMIER LEAGUE · SEASON 3</span>
      <span>WHERE CRICKET MEETS CHARACTER</span>
    </div>
  );

  return (
    <div style={{
      width, background: acc.paper, color: acc.ink,
      fontFamily: 'Inter, sans-serif',
    }}>
      {TopBar}
      {Hero}
      {HeroPhoto}
      {About}
      {ExperienceTitle}
      {Pillars}
      {Stats}
      {ClosingCTA}
      {Footer}
    </div>
  );
};

window.V1 = V1;
