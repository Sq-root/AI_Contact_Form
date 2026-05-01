// Registration screen — multi-step form
const Register = () => {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    name: '', age: '', phone: '',
    role: '', team: '', tshirt: 'M',
  });
  const set = (k) => (e) => setData({ ...data, [k]: e?.target?.value ?? e });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const Input = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        letterSpacing: 2, color: '#FFC31F', marginBottom: 6,
      }}>{label}</div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
        width: '100%', background: '#181818', border: '1px solid rgba(255,255,255,0.12)',
        color: '#fff', padding: '14px 14px', fontSize: 15,
        fontFamily: 'Inter, sans-serif', outline: 'none',
        borderRadius: 0, transition: 'border-color .2s',
      }} onFocus={(e)=>e.target.style.borderColor='#FFC31F'} onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.12)'} />
    </label>
  );

  const Pick = ({ label, options, value, onChange }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        letterSpacing: 2, color: '#FFC31F', marginBottom: 6,
      }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(options.length, 2)}, 1fr)`, gap: 6 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{
            background: value === o ? '#FFC31F' : '#181818',
            color: value === o ? '#0a0a0a' : '#fff',
            border: value === o ? '1px solid #FFC31F' : '1px solid rgba(255,255,255,0.12)',
            padding: '14px 10px', fontFamily: 'Anton, sans-serif',
            fontSize: 13, letterSpacing: 1, cursor: 'pointer',
            transition: 'all .2s', textAlign: 'left',
          }}>{o}</button>
        ))}
      </div>
    </div>
  );

  const SizePick = ({ label, options, value, onChange }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        letterSpacing: 2, color: '#FFC31F', marginBottom: 6,
      }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 6 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{
            background: value === o ? '#FFC31F' : '#181818',
            color: value === o ? '#0a0a0a' : '#fff',
            border: value === o ? '1px solid #FFC31F' : '1px solid rgba(255,255,255,0.12)',
            padding: '14px 0', fontFamily: 'Anton, sans-serif',
            fontSize: 14, cursor: 'pointer', transition: 'all .2s',
          }}>{o}</button>
        ))}
      </div>
    </div>
  );

  const StepWrap = ({ children, title, eyebrow }) => (
    <div style={{
      animation: 'aplStepIn .5s cubic-bezier(.2,.8,.2,1)',
    }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: '#E11D2A', marginBottom: 8 }}>
        {eyebrow}
      </div>
      <h2 style={{
        margin: 0, fontFamily: 'Anton, sans-serif',
        fontSize: 32, lineHeight: 0.95, textTransform: 'uppercase',
        marginBottom: 18,
      }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0a0a0a', color: '#fff',
      fontFamily: 'Inter, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes aplStepIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes aplBarFill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes aplCheck{0%{stroke-dashoffset:60}100%{stroke-dashoffset:0}}
        @keyframes aplPop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
        .apl-btn:active{transform:scale(.97)}
      `}</style>

      {/* HEADER */}
      <div style={{
        padding: '14px 16px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: '#0a0a0a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={() => step > 1 ? setStep(step-1) : window.goLanding && window.goLanding()} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10, letterSpacing: 1.5, cursor: 'pointer',
          }}>← BACK</button>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.6)' }}>
            STEP <span style={{ color: '#FFC31F' }}>{step}</span> / {totalSteps}
          </div>
        </div>
        {/* progress */}
        <div style={{ position: 'relative', height: 3, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{
            position: 'absolute', inset: 0, background: '#FFC31F',
            transformOrigin: 'left', transform: `scaleX(${progress/100})`,
            transition: 'transform .5s cubic-bezier(.2,.8,.2,1)',
          }} />
        </div>
      </div>

      {/* SCROLL AREA */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 18px 100px' }}>
        {step === 1 && (
          <StepWrap eyebrow="// 01 — WHO ARE YOU" title={<>Tell us<br />about <span style={{ color: '#FFC31F' }}>YOU.</span></>}>
            <Input label="FULL NAME" value={data.name} onChange={set('name')} placeholder="e.g. Aarav Patel" />
            <Input label="AGE" value={data.age} onChange={set('age')} placeholder="18" type="number" />
            <Input label="PHONE" value={data.phone} onChange={set('phone')} placeholder="+91 ··· ····" type="tel" />
          </StepWrap>
        )}

        {step === 2 && (
          <StepWrap eyebrow="// 02 — YOUR GAME" title={<>Pick your<br /><span style={{ color: '#FFC31F' }}>ROLE.</span></>}>
            <Pick label="CRICKET ROLE" options={['BATSMAN','BOWLER','ALL-ROUNDER','WICKET-KEEPER']} value={data.role} onChange={(v)=>setData({...data, role:v})} />
            <Pick label="PREFERRED TEAM" options={['ANY · DRAFT ME','SAARANGPUR XI','VADTAL KINGS','GADHADA WARRIORS','AKSHAR ROYALS']} value={data.team} onChange={(v)=>setData({...data, team:v})} />
          </StepWrap>
        )}

        {step === 3 && (
          <StepWrap eyebrow="// 03 — KIT" title={<>Pick your<br /><span style={{ color: '#FFC31F' }}>JERSEY.</span></>}>
            <SizePick label="T-SHIRT SIZE" options={['XS','S','M','L','XL','XXL']} value={data.tshirt} onChange={(v)=>setData({...data, tshirt:v})} />
            <div style={{
              marginTop: 18, padding: 18, background: '#181818',
              border: '1px dashed rgba(255,255,255,0.18)', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Anton, sans-serif', fontSize: 80, color: '#FFC31F', lineHeight: 1, letterSpacing: 1 }}>{data.tshirt}</div>
              <div style={{ marginTop: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.6)' }}>YOUR APL JERSEY</div>
            </div>
          </StepWrap>
        )}

        {step === 4 && (
          <StepWrap eyebrow="// 04 — CONFIRM" title={<>Almost<br /><span style={{ color: '#FFC31F' }}>THERE.</span></>}>
            <div style={{
              background: '#181818', padding: 18,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              letterSpacing: 1, lineHeight: 2,
              border: '1px dashed rgba(255,255,255,0.18)',
            }}>
              <div style={{ fontFamily: 'Anton, sans-serif', fontSize: 16, letterSpacing: 1.5, color: '#FFC31F', marginBottom: 10, paddingBottom: 8, borderBottom: '1px dashed rgba(255,255,255,0.18)' }}>S3 · REGISTRATION</div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.55 }}>NAME</span><span>{data.name || '—'}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.55 }}>AGE</span><span>{data.age || '—'}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.55 }}>PHONE</span><span>{data.phone || '—'}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.55 }}>ROLE</span><span>{data.role || '—'}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.55 }}>TEAM</span><span style={{ fontSize: 9 }}>{data.team || '—'}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ opacity:0.55 }}>JERSEY</span><span>{data.tshirt}</span></div>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, lineHeight: 1.55, color: 'rgba(255,255,255,0.65)' }}>
              By registering, you commit to APL's values: <b style={{ color: '#FFC31F' }}>brotherhood</b>, <b style={{ color: '#FFC31F' }}>discipline</b>, and <b style={{ color: '#FFC31F' }}>spirit of the game</b>. See you on opening day.
            </p>
          </StepWrap>
        )}

        {step === 5 && (
          <div style={{ textAlign: 'center', paddingTop: 40, animation: 'aplPop .6s cubic-bezier(.2,1.4,.4,1)' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: '#FFC31F', margin: '0 auto 20px',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 0 0 4px #0a0a0a, 0 0 0 5px #FFC31F, 0 0 60px rgba(255,195,31,0.4)',
            }}>
              <svg width="48" height="48" viewBox="0 0 48 48">
                <path d="M12 24l8 8 16-18" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" style={{ animation: 'aplCheck .6s .2s cubic-bezier(.2,.8,.2,1) forwards' }} />
              </svg>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: '#FFC31F', marginBottom: 6 }}>// REGISTERED</div>
            <h2 style={{ margin: 0, fontFamily: 'Anton, sans-serif', fontSize: 40, lineHeight: 0.95, textTransform: 'uppercase' }}>
              WELCOME TO<br /><span style={{ color: '#FFC31F' }}>SEASON 3.</span>
            </h2>
            <p style={{ marginTop: 14, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, padding: '0 14px' }}>
              You'll get a confirmation on <b style={{ color: '#FFC31F' }}>{data.phone || 'your phone'}</b>. See you at <b style={{ color: '#FFC31F' }}>Akshar Arena</b> on opening day.
            </p>
            <div style={{
              marginTop: 28, padding: '0 6px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
            }}>
              <div style={{ background: '#181818', padding: '14px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: 'Anton, sans-serif', fontSize: 26, color: '#FFC31F', lineHeight: 1 }}>14·06</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: 1.5, marginTop: 4, opacity: 0.6 }}>OPENING DAY</div>
              </div>
              <div style={{ background: '#181818', padding: '14px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: 'Anton, sans-serif', fontSize: 26, color: '#FFC31F', lineHeight: 1 }}>#APL</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: 1.5, marginTop: 4, opacity: 0.6 }}>YOUR ID</div>
              </div>
            </div>
            <button onClick={() => window.goLanding && window.goLanding()} className="apl-btn" style={{
              marginTop: 24, background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', padding: '12px 22px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
              cursor: 'pointer', transition: 'all .2s',
            }}>← BACK TO HOME</button>
          </div>
        )}
      </div>

      {/* FOOTER CTA — sticky */}
      {step <= totalSteps && (
        <div style={{
          padding: '14px 16px 30px',
          background: 'linear-gradient(to top, #0a0a0a 70%, rgba(10,10,10,0))',
          position: 'absolute', bottom: 0, left: 0, right: 0,
        }}>
          <button onClick={() => setStep(step + 1)} className="apl-btn" style={{
            width: '100%', background: '#FFC31F', color: '#0a0a0a',
            border: 0, padding: '16px 22px', fontFamily: 'Anton, sans-serif',
            fontSize: 16, letterSpacing: 1.5, cursor: 'pointer',
            transition: 'transform .2s',
          }}>
            {step === totalSteps ? 'CONFIRM REGISTRATION →' : 'CONTINUE →'}
          </button>
        </div>
      )}
    </div>
  );
};
window.Register = Register;
