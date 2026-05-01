// Landing screen — mobile-first, animated, cricket vibe
const Landing = () => {
  const styles = {
    wrap: {
      width: '100%', height: '100%',
      background: '#0a0a0a', color: '#fff',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden auto', position: 'relative',
      scrollbarWidth: 'none',
    },
  };
  return (
    <div style={styles.wrap} className="apl-landing">
      <style>{`
        .apl-landing::-webkit-scrollbar{display:none}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pan{0%,100%{transform:scale(1.12) translate(0,0)}50%{transform:scale(1.18) translate(-2%,-1%)}}
        @keyframes float{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(-12px,-18px) rotate(180deg)}}
        @keyframes lineUp{from{transform:translateY(110%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        .apl-l1{animation:lineUp .8s .2s cubic-bezier(.2,.8,.2,1) both}
        .apl-l2{animation:lineUp .8s .35s cubic-bezier(.2,.8,.2,1) both}
        .apl-l3{animation:lineUp .8s .5s cubic-bezier(.2,.8,.2,1) both}
        .apl-l4{animation:lineUp .8s .65s cubic-bezier(.2,.8,.2,1) both}
        .apl-fadeup{animation:fadeUp .9s 1s both}
        .apl-cta:active{transform:scale(.97)}
      `}</style>

      {/* TICKER */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden', whiteSpace: 'nowrap', padding: '7px 0',
      }}>
        <div style={{
          display: 'inline-block', animation: 'ticker 22s linear infinite',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: 2, color: '#FFC31F',
        }}>
          ★ APL S3 ★ NOW REGISTERING ★ 12 TEAMS · 64 PLAYERS ★ OPENING 14·06·2026 ★ APL S3 ★ NOW REGISTERING ★ 12 TEAMS · 64 PLAYERS ★ OPENING 14·06·2026 ★&nbsp;
        </div>
      </div>

      {/* NAV */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', position: 'sticky', top: 24, zIndex: 29,
        background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#FFC31F', color: '#0a0a0a',
            display: 'grid', placeItems: 'center',
            fontFamily: 'Anton, sans-serif', fontSize: 13,
            animation: 'spin 14s linear infinite',
          }}>A</div>
          <div style={{ fontFamily: 'Anton, sans-serif', fontSize: 11, letterSpacing: 1.5, lineHeight: 1.1 }}>
            AKSHAR PREMIER<br />
            <span style={{ color: '#FFC31F', fontSize: 9 }}>SEASON · 03</span>
          </div>
        </div>
        <div style={{
          background: '#E11D2A', color: '#fff', padding: '7px 12px',
          fontFamily: 'Anton, sans-serif', fontSize: 11, letterSpacing: 1.5,
        }}>JOIN ↗</div>
      </div>

      {/* HERO */}
      <div style={{ position: 'relative', height: 600, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(assets/team-celebration.png)',
          backgroundSize: 'cover', backgroundPosition: 'center 25%',
          filter: 'brightness(0.45) contrast(1.1)',
          animation: 'pan 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.1) 30%, rgba(10,10,10,0.95) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.25,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
        }} />

        {/* cricket ball */}
        <div style={{
          position: 'absolute', top: 60, right: 24, zIndex: 2,
          width: 56, height: 56, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #ff5a5a, #c1121f 60%, #6a0a14)',
          boxShadow: '0 0 40px rgba(255,80,80,0.35), inset -6px -8px 14px rgba(0,0,0,0.5)',
          animation: 'float 5s ease-in-out infinite',
        }}>
          <div style={{ position: 'absolute', inset: '8px 4px', borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.55)', transform: 'rotate(20deg)' }} />
          <div style={{ position: 'absolute', inset: '4px 8px', borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.55)', transform: 'rotate(-20deg)' }} />
        </div>

        <div style={{ position: 'absolute', left: 18, right: 18, bottom: 32, zIndex: 3 }}>
          <div className="apl-l1" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#E11D2A', padding: '5px 10px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 2,
            marginBottom: 18,
          }}>
            <span style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', animation: 'pulse 1.4s ease-in-out infinite' }} />
            SEASON 03 · NOW REGISTERING
          </div>
          <h1 style={{
            margin: 0, fontFamily: 'Anton, sans-serif',
            fontSize: 56, lineHeight: 0.85, letterSpacing: -0.5,
            textTransform: 'uppercase',
          }}>
            <span style={{ display: 'block', overflow: 'hidden' }}><span className="apl-l1" style={{ display: 'inline-block' }}>WHERE</span></span>
            <span style={{ display: 'block', overflow: 'hidden' }}><span className="apl-l2" style={{ display: 'inline-block', color: '#FFC31F' }}>CRICKET</span></span>
            <span style={{ display: 'block', overflow: 'hidden' }}><span className="apl-l3" style={{ display: 'inline-block' }}>MEETS</span></span>
            <span style={{ display: 'block', overflow: 'hidden' }}><span className="apl-l4" style={{ display: 'inline-block', WebkitTextStroke: '1.5px #FFC31F', color: 'transparent' }}>CHARACTER.</span></span>
          </h1>
          <div className="apl-fadeup" style={{ marginTop: 22 }}>
            <button onClick={() => window.goRegister && window.goRegister()} className="apl-cta" style={{
              background: '#FFC31F', color: '#0a0a0a', border: 0,
              padding: '14px 22px', fontFamily: 'Anton, sans-serif',
              fontSize: 14, letterSpacing: 1.5, cursor: 'pointer',
              transition: 'transform .2s', position: 'relative', overflow: 'hidden',
              width: '100%',
            }}>JOIN SEASON 3 →</button>
            <div style={{
              marginTop: 10, fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9, letterSpacing: 1.8, color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
            }}>OPENING · 14·06·2026 · AKSHAR ARENA</div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{
        background: '#FFC31F', color: '#0a0a0a',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '2px solid #0a0a0a', borderBottom: '2px solid #0a0a0a',
      }}>
        {[['03','SEASON'],['12','TEAMS'],['64','PLAYERS'],['04','PILLARS']].map(([n,l],i)=>(
          <div key={l} style={{
            padding: '14px 4px', textAlign: 'center',
            borderRight: i < 3 ? '1px solid rgba(0,0,0,0.15)' : 'none',
          }}>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: 26, lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: 1.5, marginTop: 3, opacity: 0.7 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <div style={{ padding: '40px 18px 32px', background: '#0a0a0a' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: '#FFC31F', marginBottom: 10 }}>
          // 01 — ABOUT
        </div>
        <h2 style={{
          margin: 0, fontFamily: 'Anton, sans-serif',
          fontSize: 34, lineHeight: 0.95, textTransform: 'uppercase',
        }}>
          NOT A TOURNAMENT.<br />
          <span style={{ color: '#E11D2A' }}>A BROTHERHOOD</span><br />
          WITH A SCOREBOARD.
        </h2>
        <p style={{
          marginTop: 14, fontSize: 14, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.75)', textWrap: 'pretty',
        }}>
          APL is brotherhood, <b style={{ color: '#FFC31F' }}>Atmiyata</b>, discipline, surrender, prayer, and spiritual growth — through cricket. The emotional core isn't winning trophies. It's building <b style={{ color: '#FFC31F' }}>character</b> and divine connection.
        </p>
      </div>

      {/* VALUES STRIP */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: '#0a0a0a',
      }}>
        {['BROTHERHOOD','ATMIYATA','DISCIPLINE','SURRENDER','PRAYER','GROWTH'].map((v,i)=>(
          <div key={v} style={{
            padding: '14px 8px', fontFamily: 'Anton, sans-serif',
            fontSize: 13, letterSpacing: 1.2, textAlign: 'center',
            borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}>
            <span style={{ color: '#E11D2A', fontFamily: 'JetBrains Mono, monospace', fontSize: 8, marginRight: 5 }}>{String(i+1).padStart(2,'0')}</span>
            {v}
          </div>
        ))}
      </div>

      {/* PILLARS */}
      <div style={{ padding: '40px 18px 16px', background: '#0a0a0a' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: '#FFC31F', marginBottom: 10 }}>
          // 02 — THE EXPERIENCE
        </div>
        <h2 style={{
          margin: 0, fontFamily: 'Anton, sans-serif',
          fontSize: 34, lineHeight: 0.95, textTransform: 'uppercase',
        }}>FOUR PILLARS<br /><span style={{ color: '#FFC31F' }}>ONE FAMILY.</span></h2>
      </div>

      {[
        { num:'01', label:'Blessings', desc:'Flag raised, intention set before the first ball.', src:'assets/blessing-altar.png', pos:'center 30%' },
        { num:'02', label:'Brotherhood', desc:'Strangers become teammates. Teammates become brothers.', src:'assets/team-celebration.png', pos:'center 30%' },
        { num:'03', label:'Prayer', desc:'Bare feet on the pitch. Cricket as devotion.', src:'assets/prayer-line.png', pos:'center 35%' },
        { num:'04', label:'Growth', desc:'Friendships under the banyan tree last longer than trophies.', src:'assets/banyan-group.png', pos:'center 35%' },
      ].map((p) => (
        <div key={p.num} style={{ position: 'relative', height: 220, overflow: 'hidden', marginBottom: 8 }}>
          <img src={p.src} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: p.pos,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: '#FFC31F', color: '#0a0a0a',
            padding: '3px 8px', fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9, letterSpacing: 1.5,
          }}>{p.num}</div>
          <div style={{ position: 'absolute', left: 18, right: 18, bottom: 16, color: '#fff' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 2, color: '#FFC31F', marginBottom: 4 }}>— PILLAR {p.num}</div>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: 28, letterSpacing: 1, textTransform: 'uppercase', lineHeight: 1 }}>{p.label}</div>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{p.desc}</p>
          </div>
        </div>
      ))}

      {/* MARQUEE */}
      <div style={{
        background: '#FFC31F', color: '#0a0a0a',
        padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap',
        borderTop: '2px solid #0a0a0a', borderBottom: '2px solid #0a0a0a',
        marginTop: 8,
      }}>
        <div style={{ display: 'inline-block', animation: 'ticker 18s linear infinite' }}>
          {[1,2,3].map(i => (
            <span key={i}>
              <span style={{ fontFamily: 'Anton, sans-serif', fontSize: 32, margin: '0 14px', letterSpacing: 1 }}>WHERE CRICKET MEETS</span>
              <span style={{ color: '#E11D2A', fontSize: 18, margin: '0 8px' }}>●</span>
              <span style={{ fontFamily: 'Anton, sans-serif', fontSize: 32, margin: '0 14px', letterSpacing: 1, WebkitTextStroke: '1.5px #0a0a0a', color: 'transparent' }}>CHARACTER</span>
              <span style={{ color: '#E11D2A', fontSize: 18, margin: '0 8px' }}>●</span>
            </span>
          ))}
        </div>
      </div>

      {/* JOURNEY */}
      <div style={{ padding: '40px 18px 24px', background: '#0a0a0a' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: '#FFC31F', marginBottom: 10 }}>
          // 03 — A SEASON IN PHOTOS
        </div>
        <h2 style={{ margin: 0, fontFamily: 'Anton, sans-serif', fontSize: 30, lineHeight: 0.95, textTransform: 'uppercase' }}>
          From the first <span style={{ color: '#E11D2A' }}>blessing</span> to the final <span style={{ color: '#E11D2A' }}>banyan.</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '0 12px 32px', background: '#0a0a0a' }}>
        {[
          { src:'assets/blessing-altar.png', cap:'OPENING · BLESSINGS', n:'01', pos:'center 25%' },
          { src:'assets/prayer-line.png', cap:'PRE-MATCH · PRAYER', n:'02', pos:'center 35%' },
          { src:'assets/five-batsmen.png', cap:'ON THE PITCH', n:'03', pos:'center 25%' },
          { src:'assets/banyan-group.png', cap:'CLOSING · GROWTH', n:'04', pos:'center 30%' },
        ].map(j => (
          <div key={j.n} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
            <img src={j.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: j.pos }} />
            <div style={{
              position: 'absolute', top: 6, left: 6,
              fontFamily: 'Anton, sans-serif', fontSize: 22, color: '#FFC31F',
              textShadow: '0 0 10px rgba(0,0,0,0.7)',
            }}>{j.n}</div>
            <div style={{
              position: 'absolute', left: 6, right: 6, bottom: 6,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: 1.5,
              color: '#fff', background: 'rgba(0,0,0,0.55)',
              padding: '4px 6px', backdropFilter: 'blur(3px)',
            }}>{j.cap}</div>
          </div>
        ))}
      </div>

      {/* CLOSING */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: '#E11D2A', padding: '40px 18px 32px',
        borderTop: '3px solid #FFC31F',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 16px)',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: '#FFC31F', marginBottom: 14 }}>
            // 04 — JOIN US
          </div>
          <h3 style={{
            margin: 0, fontFamily: 'Anton, sans-serif',
            fontSize: 60, lineHeight: 0.85, textTransform: 'uppercase', color: '#fff',
          }}>SEASON 3<br /><span style={{ color: '#FFC31F' }}>IS CALLING.</span></h3>

          <div style={{
            marginTop: 22, background: 'rgba(0,0,0,0.4)',
            border: '1px dashed rgba(255,255,255,0.4)',
            padding: 18, fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, letterSpacing: 1, lineHeight: 1.9, color: '#fff',
            position: 'relative',
          }}>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: 18, letterSpacing: 1.5, marginBottom: 10, paddingBottom: 8, borderBottom: '1px dashed rgba(255,255,255,0.3)' }}>SEASON · 03 · TICKET</div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.6 }}>OPENING</span><span style={{ color:'#FFC31F' }}>14·06·2026</span></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.6 }}>VENUE</span><span style={{ color:'#FFC31F' }}>AKSHAR ARENA</span></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.6 }}>FORMAT</span><span style={{ color:'#FFC31F' }}>T10 · 6-OVER</span></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.6 }}>TEAMS</span><span style={{ color:'#FFC31F' }}>12 / 12</span></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.6 }}>PLAYERS</span><span style={{ color:'#FFC31F' }}>64</span></div>
          </div>

          <button onClick={() => window.goRegister && window.goRegister()} className="apl-cta" style={{
            marginTop: 18, width: '100%',
            background: '#0a0a0a', color: '#FFC31F',
            border: '2px solid #FFC31F', padding: '16px 22px',
            fontFamily: 'Anton, sans-serif', fontSize: 16, letterSpacing: 1.5,
            cursor: 'pointer', transition: 'transform .2s',
          }}>REGISTER NOW →</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        background: '#0a0a0a', color: 'rgba(255,255,255,0.55)',
        padding: '16px 18px 30px', borderTop: '1px solid rgba(255,255,255,0.1)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1.5,
        textAlign: 'center', lineHeight: 1.8,
      }}>
        © AKSHAR PREMIER LEAGUE · <span style={{ color: '#FFC31F' }}>SEASON 03</span><br />
        WHERE CRICKET MEETS CHARACTER
      </div>
    </div>
  );
};
window.Landing = Landing;
