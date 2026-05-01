// V2 — Stadium Edition: dramatic full-bleed hero, scoreboard stats, ticket-stub sections
const V2 = ({ width = 414, isDesktop = false }) => {
  const acc = {
    yellow: '#FFC32E',
    red: '#D81E2C',
    ink: '#0B0B0B',
    cream: '#F1ECE0',
  };

  const TickerBar = (
    <div style={{
      background: acc.ink, color: acc.yellow,
      padding: isDesktop ? '8px 0' : '6px 0',
      borderBottom: `1px solid #2a2a2a`,
      overflow: 'hidden', whiteSpace: 'nowrap',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: isDesktop ? 11 : 9, letterSpacing: 2,
    }}>
      <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'tickerScroll 24s linear infinite' }}>
        ★ SEASON 3 LIVE ★ AKSHAR PREMIER LEAGUE ★ 12 TEAMS · 64 PLAYERS · 4 PILLARS ★ BROTHERHOOD · ATMIYATA · DISCIPLINE · PRAYER ★ REGISTRATION OPEN ★&nbsp;&nbsp;
      </div>
    </div>
  );

  const Nav = (
    <div style={{
      background: acc.yellow, padding: isDesktop ? '14px 40px' : '10px 14px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: `3px solid ${acc.ink}`,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{
          width: isDesktop ? 40 : 30, height: isDesktop ? 40 : 30,
          background: acc.red, color: '#fff',
          fontFamily: 'Anton, sans-serif', display: 'grid', placeItems: 'center',
          fontSize: isDesktop ? 18 : 13, transform: 'rotate(-4deg)',
          boxShadow: `2px 2px 0 ${acc.ink}`,
        }}>A</div>
        <div>
          <div style={{ fontFamily: 'Anton, sans-serif', fontSize: isDesktop ? 18 : 13, lineHeight: 1, letterSpacing: 1 }}>AKSHAR PREMIER LEAGUE</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: isDesktop ? 10 : 8, letterSpacing: 2, color: '#444' }}>EST. 2024 · SEASON 03</div>
        </div>
      </div>
      {isDesktop && (
        <div style={{ display: 'flex', gap: 22, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5, fontWeight: 600 }}>
          <span>EXPERIENCE</span><span>TEAMS</span><span>SCHEDULE</span><span>VALUES</span>
        </div>
      )}
      <button style={{
        background: acc.ink, color: acc.yellow, border: 'none',
        padding: isDesktop ? '10px 18px' : '6px 10px',
        fontFamily: 'Anton, sans-serif', letterSpacing: 1.5,
        fontSize: isDesktop ? 13 : 10, cursor: 'pointer',
      }}>REGISTER ↗</button>
    </div>
  );

  const Hero = (
    <div style={{ position: 'relative', background: acc.ink, color: '#fff', height: isDesktop ? 720 : 520, overflow: 'hidden' }}>
      <img src="assets/team-celebration.png" alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center 25%',
        filter: 'brightness(0.6) contrast(1.05)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(11,11,11,0.7) 0%, rgba(11,11,11,0.2) 40%, rgba(11,11,11,0.95) 100%)`,
      }} />
      {/* corner brackets */}
      <div style={{ position: 'absolute', top: 16, left: 16, width: 28, height: 28, borderTop: `2px solid ${acc.yellow}`, borderLeft: `2px solid ${acc.yellow}` }} />
      <div style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderTop: `2px solid ${acc.yellow}`, borderRight: `2px solid ${acc.yellow}` }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, width: 28, height: 28, borderBottom: `2px solid ${acc.yellow}`, borderLeft: `2px solid ${acc.yellow}` }} />
      <div style={{ position: 'absolute', bottom: 16, right: 16, width: 28, height: 28, borderBottom: `2px solid ${acc.yellow}`, borderRight: `2px solid ${acc.yellow}` }} />

      <div style={{
        position: 'absolute', left: isDesktop ? 56 : 18, right: isDesktop ? 56 : 18,
        bottom: isDesktop ? 56 : 28,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: acc.red, color: '#fff', padding: '6px 12px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: isDesktop ? 12 : 10, letterSpacing: 2,
          marginBottom: 18,
        }}>
          <span style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          SEASON 03 · NOW REGISTERING
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'Anton, sans-serif',
          fontSize: isDesktop ? 168 : 56, lineHeight: 0.85,
          letterSpacing: -1, textTransform: 'uppercase',
        }}>
          WHERE<br />
          <span style={{ color: acc.yellow, WebkitTextStroke: '0', display: 'inline-block' }}>CRICKET</span><br />
          MEETS<br />
          <span style={{ WebkitTextStroke: `2px ${acc.yellow}`, color: 'transparent' }}>CHARACTER.</span>
        </h1>
        <div style={{
          marginTop: isDesktop ? 28 : 16,
          display: 'flex', gap: isDesktop ? 16 : 10, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <button style={{
            background: acc.yellow, color: acc.ink, border: 'none',
            padding: isDesktop ? '16px 24px' : '10px 16px',
            fontFamily: 'Anton, sans-serif',
            fontSize: isDesktop ? 18 : 13, letterSpacing: 1.5, cursor: 'pointer',
          }}>JOIN SEASON 3 →</button>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isDesktop ? 12 : 10, letterSpacing: 2,
            color: 'rgba(255,255,255,0.85)',
          }}>OPENING · 14 · 06 · 2026</div>
        </div>
      </div>
    </div>
  );

  const Scoreboard = (
    <div style={{
      background: acc.ink, color: acc.yellow,
      padding: isDesktop ? '32px 56px' : '20px 14px',
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'repeat(5, 1fr)' : 'repeat(5, 1fr)',
      borderTop: `2px dashed #333`, borderBottom: `2px dashed #333`,
      gap: 4,
    }}>
      {[
        ['S3', 'SEASON'],
        ['12', 'TEAMS'],
        ['64', 'PLAYERS'],
        ['28', 'MATCHES'],
        ['04', 'PILLARS'],
      ].map(([n, l], i, a) => (
        <div key={l} style={{
          textAlign: 'center',
          borderRight: i < a.length - 1 ? `1px solid #2b2b2b` : 'none',
        }}>
          <div style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: isDesktop ? 56 : 24, lineHeight: 1, color: acc.yellow,
            fontVariantNumeric: 'tabular-nums',
          }}>{n}</div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isDesktop ? 11 : 8, letterSpacing: 1.5,
            marginTop: 6, color: 'rgba(255,195,46,0.6)',
          }}>{l}</div>
        </div>
      ))}
    </div>
  );

  const About = (
    <div style={{
      background: acc.cream, color: acc.ink,
      padding: isDesktop ? '72px 56px' : '40px 18px',
      position: 'relative',
    }}>
      <div style={{
        display: 'inline-block', background: acc.ink, color: acc.yellow,
        padding: '4px 10px', fontFamily: 'JetBrains Mono, monospace',
        fontSize: isDesktop ? 11 : 9, letterSpacing: 2, marginBottom: 18,
      }}>// 01 — THE LEAGUE</div>
      <h2 style={{
        margin: 0, fontFamily: 'Anton, sans-serif',
        fontSize: isDesktop ? 60 : 28, lineHeight: 1, textTransform: 'uppercase',
        maxWidth: isDesktop ? 800 : '100%', textWrap: 'balance',
      }}>
        Not a tournament. <span style={{ color: acc.red }}>A brotherhood</span> with a scoreboard.
      </h2>
      <p style={{
        marginTop: 18, fontFamily: 'Inter, sans-serif',
        fontSize: isDesktop ? 19 : 14, lineHeight: 1.55,
        maxWidth: isDesktop ? 720 : '100%', textWrap: 'pretty', color: '#222',
      }}>
        APL is brotherhood, Atmiyata, discipline, surrender, prayer, sportsmanship, and spiritual
        growth — through cricket. The emotional core isn't winning trophies. It's building character,
        friendships, and divine connection.
      </p>
      {/* values strip */}
      <div style={{
        marginTop: isDesktop ? 36 : 22,
        display: 'flex', gap: 0, flexWrap: 'wrap',
        borderTop: `1px solid ${acc.ink}`, borderBottom: `1px solid ${acc.ink}`,
      }}>
        {['BROTHERHOOD', 'ATMIYATA', 'DISCIPLINE', 'SURRENDER', 'PRAYER', 'GROWTH'].map((v, i) => (
          <div key={v} style={{
            flex: '1 1 33%',
            padding: isDesktop ? '16px 14px' : '10px 8px',
            fontFamily: 'Anton, sans-serif',
            fontSize: isDesktop ? 18 : 11, letterSpacing: 1.5,
            borderRight: (i + 1) % 3 !== 0 ? `1px solid ${acc.ink}` : 'none',
            borderTop: i >= 3 ? `1px solid ${acc.ink}` : 'none',
            textAlign: 'center',
          }}>
            <span style={{ color: acc.red, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, marginRight: 6 }}>{String(i + 1).padStart(2, '0')}</span>
            {v}
          </div>
        ))}
      </div>
    </div>
  );

  const ExperienceHeader = (
    <div style={{
      background: acc.ink, color: '#fff',
      padding: isDesktop ? '60px 56px 24px' : '32px 18px 12px',
    }}>
      <div style={{
        display: 'inline-block', background: acc.yellow, color: acc.ink,
        padding: '4px 10px', fontFamily: 'JetBrains Mono, monospace',
        fontSize: isDesktop ? 11 : 9, letterSpacing: 2, marginBottom: 14,
      }}>// 02 — THE EXPERIENCE</div>
      <h2 style={{
        margin: 0, fontFamily: 'Anton, sans-serif',
        fontSize: isDesktop ? 88 : 38, lineHeight: 0.95, textTransform: 'uppercase',
      }}>
        FOUR PILLARS<br />
        <span style={{ color: acc.yellow }}>ONE FAMILY.</span>
      </h2>
    </div>
  );

  const PillarItem = ({ num, label, desc, src, pos = 'center', flip }) => (
    <div style={{
      display: 'grid', gridTemplateColumns: isDesktop ? (flip ? '1fr 1.4fr' : '1.4fr 1fr') : '1fr',
      background: acc.ink, color: '#fff',
      borderTop: `1px solid #1c1c1c`,
    }}>
      <div style={{
        order: flip && isDesktop ? 2 : 1,
        position: 'relative', overflow: 'hidden',
        height: isDesktop ? 380 : 220,
      }}>
        <img src={src} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos,
          filter: 'saturate(0.95) contrast(1.05)',
        }} />
      </div>
      <div style={{
        order: flip && isDesktop ? 1 : 2,
        padding: isDesktop ? '40px 36px' : '20px 18px 28px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: acc.ink,
      }}>
        <div style={{
          fontFamily: 'Anton, sans-serif', color: acc.yellow,
          fontSize: isDesktop ? 80 : 40, lineHeight: 1,
        }}>{num}</div>
        <div style={{
          fontFamily: 'Anton, sans-serif', fontSize: isDesktop ? 36 : 22,
          letterSpacing: 1.5, marginTop: 4, textTransform: 'uppercase',
        }}>{label}</div>
        <p style={{
          margin: '12px 0 0', fontFamily: 'Inter, sans-serif',
          fontSize: isDesktop ? 16 : 13, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.75)', maxWidth: 380, textWrap: 'pretty',
        }}>{desc}</p>
      </div>
    </div>
  );

  const Pillars = (
    <div style={{ background: acc.ink }}>
      <PillarItem num="01" label="Blessings" desc="Every season opens at the murti — flag raised, blessings sought, intention set." src="assets/blessing-altar.png" pos="center 35%" />
      <PillarItem num="02" label="Brotherhood" desc="Strangers become teammates. Teammates become brothers. The bench is the best part." src="assets/team-celebration.png" pos="center 30%" flip />
      <PillarItem num="03" label="Prayer" desc="Bare feet on the pitch. Hands together before the first ball. Cricket as devotion." src="assets/prayer-line.png" pos="center 35%" />
      <PillarItem num="04" label="Growth" desc="On the field and off. Friendships under the banyan tree last longer than any trophy." src="assets/banyan-group.png" pos="center 35%" flip />
    </div>
  );

  const ClosingCTA = (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: acc.red,
      padding: isDesktop ? '72px 56px' : '40px 18px',
      color: '#fff', borderTop: `4px solid ${acc.yellow}`,
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.12,
        backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 18px)',
      }} />
      <div style={{
        position: 'relative',
        display: 'grid', gridTemplateColumns: isDesktop ? '1.3fr 1fr' : '1fr', gap: isDesktop ? 32 : 18,
        alignItems: 'end',
      }}>
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: 2,
            fontSize: isDesktop ? 12 : 10, marginBottom: 12, opacity: 0.85,
          }}>// 03 — JOIN US</div>
          <h3 style={{
            margin: 0, fontFamily: 'Anton, sans-serif',
            fontSize: isDesktop ? 128 : 50, lineHeight: 0.9, letterSpacing: 0,
            textTransform: 'uppercase',
          }}>SEASON 3<br /><span style={{ color: acc.yellow }}>IS CALLING.</span></h3>
          <button style={{
            marginTop: 22, background: acc.ink, color: acc.yellow,
            border: `2px solid ${acc.yellow}`, padding: isDesktop ? '16px 24px' : '12px 18px',
            fontFamily: 'Anton, sans-serif', fontSize: isDesktop ? 18 : 13,
            letterSpacing: 1.5, cursor: 'pointer',
          }}>REGISTER NOW →</button>
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: isDesktop ? 12 : 10, letterSpacing: 1.5,
          background: 'rgba(0,0,0,0.25)', padding: isDesktop ? 18 : 14,
          border: `1px dashed rgba(255,255,255,0.4)`,
          textWrap: 'pretty',
        }}>
          <div style={{ opacity: 0.7, marginBottom: 6 }}>// REGISTRATION OPEN</div>
          <div>OPENING DAY ······· 14.06.2026</div>
          <div>VENUE ············· AKSHAR ARENA</div>
          <div>FORMAT ············ T10 · 6-OVER</div>
          <div>TEAMS ············· 12 / 12 FILLING</div>
        </div>
      </div>
    </div>
  );

  const Footer = (
    <div style={{
      background: acc.ink, color: 'rgba(255,255,255,0.55)',
      padding: isDesktop ? '24px 56px' : '14px 14px',
      fontFamily: 'JetBrains Mono, monospace', fontSize: isDesktop ? 11 : 9,
      letterSpacing: 1.5, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
    }}>
      <span>© AKSHAR PREMIER LEAGUE — S3</span>
      <span>BROTHERHOOD · ATMIYATA · GROWTH</span>
    </div>
  );

  return (
    <div style={{
      width, background: acc.cream, color: acc.ink,
      fontFamily: 'Inter, sans-serif',
    }}>
      <style>{`
        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-100%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      {TickerBar}
      {Nav}
      {Hero}
      {Scoreboard}
      {About}
      {ExperienceHeader}
      {Pillars}
      {ClosingCTA}
      {Footer}
    </div>
  );
};

window.V2 = V2;
