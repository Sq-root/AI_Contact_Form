// V3 — Editorial Devotion: cream paper, magazine grid, refined sport-meets-spirit
const V3 = ({ width = 414, isDesktop = false }) => {
  const acc = {
    paper: '#F1E9D8',
    ink: '#15110A',
    saffron: '#E07A1F',
    deepRed: '#A41C1C',
    green: '#0E5D3A',
  };

  const Masthead = (
    <div style={{
      background: acc.paper, color: acc.ink,
      borderBottom: `1px solid ${acc.ink}`,
      padding: isDesktop ? '14px 40px' : '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: isDesktop ? 11 : 9, letterSpacing: 2,
      }}>VOL. III · MMXXVI · ISSUE 1</div>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif', fontWeight: 600,
        fontStyle: 'italic',
        fontSize: isDesktop ? 18 : 13, letterSpacing: 1,
      }}>The APL Gazette</div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: isDesktop ? 11 : 9, letterSpacing: 2,
      }}>SAARANGPUR · GUJ.</div>
    </div>
  );

  const Hero = (
    <div style={{
      background: acc.paper, color: acc.ink,
      padding: isDesktop ? '40px 56px 56px' : '24px 18px 28px',
      borderBottom: `1px solid ${acc.ink}`,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: isDesktop ? 11 : 9, letterSpacing: 2, marginBottom: isDesktop ? 18 : 10,
      }}>
        <span>·· FEATURE ··</span>
        <span>SEASON THREE</span>
      </div>
      <h1 style={{
        margin: 0,
        fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
        fontSize: isDesktop ? 132 : 50, lineHeight: 0.92, letterSpacing: -1,
        textWrap: 'balance',
      }}>
        Where <em style={{ color: acc.deepRed, fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}>cricket</em> meets
        <br />
        <span style={{ color: acc.saffron }}>character.</span>
      </h1>
      <div style={{
        marginTop: isDesktop ? 28 : 16,
        display: 'grid', gridTemplateColumns: isDesktop ? '2fr 1fr' : '1fr',
        gap: isDesktop ? 40 : 16, alignItems: 'start',
      }}>
        <p style={{
          margin: 0, fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
          fontSize: isDesktop ? 26 : 17, lineHeight: 1.4, color: '#2a2418',
          textWrap: 'pretty',
          fontStyle: 'italic',
        }}>
          A field, a flag, four pillars. The Akshar Premier League is not a tournament — it is a season-long
          devotion to brotherhood, prayer, and the slow miracle of becoming who you are meant to be.
        </p>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: isDesktop ? 11 : 10, letterSpacing: 1.5, lineHeight: 1.8,
          paddingLeft: isDesktop ? 16 : 0,
          borderLeft: isDesktop ? `1px solid ${acc.ink}` : 'none',
        }}>
          <div style={{ color: acc.deepRed, marginBottom: 6 }}>──── SEASON 3</div>
          <div>OPENING · 14 JUNE</div>
          <div>TEAMS · TWELVE</div>
          <div>PLAYERS · SIXTY-FOUR</div>
          <div>FORMAT · T10</div>
          <div style={{ marginTop: 10, color: acc.saffron }}>───── REGISTER →</div>
        </div>
      </div>
    </div>
  );

  const FeaturePhoto = (
    <div style={{ background: acc.paper, padding: isDesktop ? '0 56px 24px' : '0 18px 14px' }}>
      <div style={{ position: 'relative' }}>
        <img src="assets/team-celebration.png" alt="" style={{
          width: '100%', height: isDesktop ? 520 : 240,
          objectFit: 'cover', objectPosition: 'center 30%',
          display: 'block',
          filter: 'sepia(0.18) saturate(1.05) contrast(1.02)',
        }} />
      </div>
      <div style={{
        marginTop: 8,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
        fontSize: isDesktop ? 14 : 11, color: '#5a5340',
        flexWrap: 'wrap', gap: 8,
      }}>
        <span>Fig. 01 — The opening ceremony, Season 2 closing day.</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontStyle: 'normal', fontSize: isDesktop ? 10 : 9, letterSpacing: 2, color: '#7a6f53' }}>PHOTO · APL ARCHIVES</span>
      </div>
    </div>
  );

  const About = (
    <div style={{
      background: acc.paper, color: acc.ink,
      padding: isDesktop ? '60px 56px' : '32px 18px',
      borderTop: `1px solid ${acc.ink}`, borderBottom: `1px solid ${acc.ink}`,
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: isDesktop ? '1fr 2fr' : '1fr',
        gap: isDesktop ? 56 : 18,
      }}>
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isDesktop ? 11 : 9, letterSpacing: 2,
            color: acc.deepRed, marginBottom: 6,
          }}>§ I.</div>
          <h2 style={{
            margin: 0, fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
            fontSize: isDesktop ? 56 : 28, lineHeight: 1, letterSpacing: -0.5,
            textWrap: 'balance',
          }}>About<br /><em>the league.</em></h2>
        </div>
        <div>
          <p style={{
            margin: 0, fontFamily: 'Cormorant Garamond, serif',
            fontSize: isDesktop ? 22 : 16, lineHeight: 1.55, color: '#1d1810',
            textWrap: 'pretty',
          }}>
            <span style={{
              float: 'left', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600,
              fontSize: isDesktop ? 92 : 56, lineHeight: 0.85, color: acc.deepRed,
              paddingRight: 10, paddingTop: 6,
            }}>A</span>
            PL is about brotherhood, Atmiyata, values, discipline, surrender, prayer, sportsmanship,
            and spiritual growth — through cricket. The emotional core is not winning trophies, but
            building character, friendships, and divine connection. We meet at the crease and leave
            as family.
          </p>
        </div>
      </div>
    </div>
  );

  const PullQuote = (
    <div style={{
      background: acc.deepRed, color: acc.paper,
      padding: isDesktop ? '64px 56px' : '36px 18px',
      textAlign: 'center', position: 'relative',
    }}>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: isDesktop ? 200 : 110, lineHeight: 0.6,
        position: 'absolute', top: isDesktop ? 30 : 14, left: isDesktop ? 56 : 18,
        opacity: 0.45, color: acc.saffron,
      }}>“</div>
      <p style={{
        margin: 0, fontFamily: 'Cormorant Garamond, serif',
        fontSize: isDesktop ? 48 : 22, lineHeight: 1.2, fontStyle: 'italic',
        fontWeight: 500, maxWidth: 920, marginInline: 'auto',
        textWrap: 'balance',
      }}>
        Cricket is the sport. <span style={{ color: acc.saffron }}>Atmiyata</span> is the season.
      </p>
      <div style={{
        marginTop: isDesktop ? 22 : 14,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: isDesktop ? 11 : 9, letterSpacing: 2, opacity: 0.8,
      }}>—— APL CREDO · S3</div>
    </div>
  );

  const Pillar = ({ num, label, sanskrit, desc, src, pos = 'center' }) => (
    <article style={{
      background: acc.paper, color: acc.ink,
      borderRight: `1px solid ${acc.ink}`,
      padding: 0, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ aspectRatio: '4/5', overflow: 'hidden', position: 'relative' }}>
        <img src={src} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos,
          filter: 'sepia(0.2) saturate(1.05) contrast(1.05)',
        }} />
      </div>
      <div style={{ padding: isDesktop ? '22px 22px 28px' : '14px 14px 18px', flex: 1 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          borderBottom: `1px solid ${acc.ink}`, paddingBottom: 8, marginBottom: 10,
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isDesktop ? 11 : 9, letterSpacing: 2, color: acc.deepRed,
          }}>§ {num}</span>
          <span style={{
            fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
            fontSize: isDesktop ? 14 : 11, color: '#5a5340',
          }}>{sanskrit}</span>
        </div>
        <h3 style={{
          margin: 0, fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
          fontSize: isDesktop ? 36 : 22, letterSpacing: -0.3,
        }}>{label}.</h3>
        <p style={{
          margin: '8px 0 0', fontFamily: 'Cormorant Garamond, serif',
          fontSize: isDesktop ? 17 : 13, lineHeight: 1.45, color: '#2a2418',
          textWrap: 'pretty',
        }}>{desc}</p>
      </div>
    </article>
  );

  const Pillars = (
    <div style={{ background: acc.paper, borderTop: `1px solid ${acc.ink}` }}>
      <div style={{
        padding: isDesktop ? '40px 56px 16px' : '24px 18px 8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        borderBottom: `1px solid ${acc.ink}`,
      }}>
        <h2 style={{
          margin: 0, fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
          fontSize: isDesktop ? 64 : 30, letterSpacing: -0.5, lineHeight: 1,
        }}>The APL <em style={{ color: acc.saffron }}>Experience</em></h2>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: isDesktop ? 12 : 10, letterSpacing: 2, color: acc.deepRed,
        }}>§ II — IV PILLARS</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
        borderBottom: `1px solid ${acc.ink}`,
      }}>
        <Pillar num="01" label="Blessings" sanskrit="ashirvad" desc="Every season opens at the murti — flag raised, hands clasped, intention set before the first ball." src="assets/blessing-altar.png" pos="center 30%" />
        <Pillar num="02" label="Brotherhood" sanskrit="bandhutva" desc="The bench is the best part. Strangers become teammates; teammates become brothers." src="assets/team-celebration.png" pos="center 30%" />
        <Pillar num="03" label="Prayer" sanskrit="prarthana" desc="Bare feet on the pitch, hands together at the boundary. Cricket as devotion, not contest." src="assets/prayer-line.png" pos="center 30%" />
        <Pillar num="04" label="Growth" sanskrit="vikas" desc="On the field and off. Friendships under the banyan tree last longer than any trophy." src="assets/banyan-group.png" pos="center 30%" />
      </div>
    </div>
  );

  const Closing = (
    <div style={{
      background: acc.ink, color: acc.paper,
      padding: isDesktop ? '64px 56px' : '36px 18px',
      display: 'grid', gridTemplateColumns: isDesktop ? '1.4fr 1fr' : '1fr',
      gap: isDesktop ? 32 : 20, alignItems: 'center',
    }}>
      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', color: acc.saffron,
          fontSize: isDesktop ? 12 : 10, letterSpacing: 2, marginBottom: 14,
        }}>§ III — JOIN US</div>
        <h3 style={{
          margin: 0, fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
          fontSize: isDesktop ? 96 : 42, lineHeight: 0.95, letterSpacing: -1,
          textWrap: 'balance',
        }}>
          Season 3 <em style={{ color: acc.saffron }}>is calling.</em>
        </h3>
        <p style={{
          margin: '14px 0 0', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
          fontSize: isDesktop ? 22 : 15, lineHeight: 1.4, opacity: 0.85,
          maxWidth: 540, textWrap: 'pretty',
        }}>
          Twelve teams. Sixty-four players. One family. Bring your bat, your bare feet, and your
          best self.
        </p>
        <div style={{ marginTop: isDesktop ? 26 : 18, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: acc.saffron, color: acc.ink, border: 'none',
            padding: isDesktop ? '14px 22px' : '10px 16px',
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 600,
            fontSize: isDesktop ? 18 : 14, letterSpacing: 0.5, cursor: 'pointer',
          }}>Register for Season 3 →</button>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isDesktop ? 11 : 9, letterSpacing: 2, opacity: 0.7,
          }}>OPENS · 14 · 06 · 2026</span>
        </div>
      </div>
      <div style={{
        position: 'relative', overflow: 'hidden',
        height: isDesktop ? 280 : 180,
        border: `1px solid ${acc.saffron}`,
      }}>
        <img src="assets/five-batsmen.png" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%',
          filter: 'sepia(0.2) saturate(1.1)',
        }} />
        <div style={{
          position: 'absolute', bottom: 8, left: 8, right: 8,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: isDesktop ? 10 : 9, letterSpacing: 2, color: acc.paper,
          background: 'rgba(0,0,0,0.45)', padding: '4px 8px',
        }}>FIG. 02 — THE BATSMEN, S2.</div>
      </div>
    </div>
  );

  const Footer = (
    <div style={{
      background: acc.paper, color: acc.ink,
      borderTop: `1px solid ${acc.ink}`,
      padding: isDesktop ? '20px 56px' : '14px 18px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: isDesktop ? 11 : 9, letterSpacing: 2,
      display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
    }}>
      <span>THE APL GAZETTE · MMXXVI</span>
      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', letterSpacing: 0 }}>fin.</span>
    </div>
  );

  return (
    <div style={{
      width, background: acc.paper, color: acc.ink,
      fontFamily: 'Cormorant Garamond, serif',
    }}>
      {Masthead}
      {Hero}
      {FeaturePhoto}
      {About}
      {PullQuote}
      {Pillars}
      {Closing}
      {Footer}
    </div>
  );
};

window.V3 = V3;
