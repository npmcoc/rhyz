import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .submit {
    color: #9fc4d0;
    text-decoration: none;
    font-size: 25px;
    border: none;
    background: none;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
    margin: 10px 0 0;
    cursor: pointer;
  }

  .submit::before {
    margin-left: auto;
  }

  .submit::after,
  .submit::before {
    content: "";
    width: 0%;
    height: 2px;
    background: #06aed8;
    display: block;
    transition: 0.5s;
  }

  .submit:hover::after,
  .submit:hover::before {
    width: 100%;
  }

  .container {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-style: italic;
    font-weight: bold;
    display: flex;
    margin: auto;
    aspect-ratio: 16/9;
    align-items: center;
    justify-items: center;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1em;
  }

  .input-container {
    filter: drop-shadow(46px 36px 24px #4090b5)
      drop-shadow(-55px -40px 25px #9e30a9);
    animation: blinkShadowsFilter 8s ease-in infinite;
  }

  .input-content {
    display: grid;
    align-content: center;
    justify-items: center;
    align-items: center;
    text-align: center;
    padding-inline: 1em;
    position: relative;
    padding: 20px;
  }

  .input-content::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    filter: blur(40px);
    background: rgba(122, 251, 255, 0.5568627451);
    transition: all 1s ease-in-out;
    z-index: -1;
  }

  .input-content::after {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 0px 0px 20px 20px #212121;
    background: repeating-linear-gradient(
        to bottom,
        transparent 0%,
        rgba(64, 144, 181, 0.6) 1px,
        rgb(0, 0, 0) 3px,
        hsl(295, 60%, 12%) 5px,
        #153544 4px,
        transparent 0.5%
      ),
      repeating-linear-gradient(
        to left,
        hsl(295, 60%, 12%) 100%,
        hsla(295, 60%, 12%, 0.99) 100%
      );
    animation: backglitch 50ms linear infinite;
    z-index: -1;
  }

  .input-dist {
    z-index: 80;
    display: grid;
    align-items: center;
    text-align: center;
    width: 100%;
    padding-inline: 1em;
    padding-block: 1.2em;
    grid-template-columns: 1fr;
  }

  .input-type {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1em;
    font-size: 1.1rem;
    background-color: transparent;
    width: 100%;
    border: none;
  }

  .input-is {
    color: #fff;
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    padding-inline: 0.5em;
    padding-block: 0.7em;
    border: none;
    transition: all 1s ease-in-out;
    border-bottom: 1px solid hsl(221, 26%, 43%);
  }

  .input-is:hover {
    transition: all 1s ease-in-out;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(102, 224, 255, 0.2) 27%,
      rgba(102, 224, 255, 0.2) 63%,
      transparent 100%
    );
  }

  .input-content:focus-within::before {
    transition: all 1s ease-in-out;
    background: hsla(0, 0%, 100%, 0.814);
  }

  .input-is:focus {
    outline: none;
    border-bottom: 1px solid hsl(192, 100%, 100%);
    color: hsl(192, 100%, 88%);
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(102, 224, 255, 0.2) 27%,
      rgba(102, 224, 255, 0.2) 63%,
      transparent 100%
    );
  }

  .input-is::placeholder {
    color: hsla(192, 100%, 88%, 0.806);
  }

  @keyframes backglitch {
    0% { box-shadow: inset 0px 20px 20px 30px #212121; }
    50% { box-shadow: inset 0px -20px 20px 30px hsl(297, 42%, 10%); }
    to { box-shadow: inset 0px 20px 20px 30px #212121; }
  }

  @keyframes blinkShadowsFilter {
    0% { filter: drop-shadow(46px 36px 28px rgba(64, 144, 181, 0.34)) drop-shadow(-55px -40px 28px #9e30a9); }
    25% { filter: drop-shadow(46px -36px 24px rgba(64, 144, 181, 0.89)) drop-shadow(-55px 40px 24px #9e30a9); }
    50% { filter: drop-shadow(46px 36px 30px rgba(64, 144, 181, 0.89)) drop-shadow(-55px 40px 30px rgba(159, 48, 169, 0.29)); }
    75% { filter: drop-shadow(20px -18px 25px rgba(64, 144, 181, 0.89)) drop-shadow(-20px 20px 25px rgba(159, 48, 169, 0.29)); }
    to { filter: drop-shadow(46px 36px 28px rgba(64, 144, 181, 0.34)) drop-shadow(-55px -40px 28px #9e30a9); }
  }
`;

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tags, setTags] = useState([]); // Array of { tag, name }
  const [newTag, setNewTag] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [clansPerRow, setClansPerRow] = useState(3);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'check' })
      });
      setLoading(false);
      if (res.ok) {
        setIsLoggedIn(true);
        fetchData();
      } else {
        const data = await res.json().catch(() => ({ message: 'Invalid Password' }));
        setMsg(data.message || 'Invalid Password');
      }
    } catch (err) {
      setLoading(false);
      setMsg('Connection error');
    }
  };

  const fetchData = async () => {
    const res = await fetch('/api/admin');
    const data = await res.json();
    setTags(data.enrichedTags || []);
    if (data.settings?.clansPerRow) {
      setClansPerRow(data.settings.clansPerRow);
    }
  };

  const handleAction = async (action, payload) => {
    setLoading(true);
    setMsg('');
    
    let body = { password, action };
    if (action === 'add') body.tag = payload || newTag;
    if (action === 'remove') body.tag = payload;
    if (action === 'reorder') body.newTags = payload;
    if (action === 'settings') body.settings = payload;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Operation failed' }));
        setLoading(false);
        setMsg(data.message || 'Operation failed');
        return;
      }
      
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        // Refresh data to get updated names/order
        fetchData(); 
        if (action === 'add') setNewTag('');
        setMsg('Operation successful');
      } else {
        setMsg(data.message || 'Operation failed');
      }
    } catch (err) {
      setLoading(false);
      setMsg('Connection error: ' + err.message);
    }
  };

  const moveTag = (index, direction) => {
    const newTagsList = [...tags];
    if (direction === 'up' && index > 0) {
      [newTagsList[index], newTagsList[index - 1]] = [newTagsList[index - 1], newTagsList[index]];
    } else if (direction === 'down' && index < newTagsList.length - 1) {
      [newTagsList[index], newTagsList[index + 1]] = [newTagsList[index + 1], newTagsList[index]];
    } else {
      return;
    }
    // Optimistic update
    setTags(newTagsList);
    // Send only tags array to API
    handleAction('reorder', newTagsList.map(t => t.tag));
  };

  const handleSettingsChange = (e) => {
    const val = parseInt(e.target.value);
    setClansPerRow(val);
    handleAction('settings', { clansPerRow: val });
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh'}}>
          <StyledWrapper>
            <form className="container" onSubmit={login}>
              <div className="input-container">
                <div className="input-content">
                  <div className="input-dist">
                    <div className="input-type">
                      <input 
                        type="text" 
                        name="username" 
                        autoComplete="username" 
                        style={{ display: 'none' }} 
                        tabIndex="-1" 
                        aria-hidden="true"
                      />
                      <input 
                        className="input-is" 
                        type="password" 
                        required 
                        placeholder="Admin Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button className="submit" disabled={loading}>
                        {loading ? '...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {msg && <p style={{color: '#ff5f2e', textShadow: '0 0 5px black', marginTop: '10px'}}>{msg}</p>}
            </form>
          </StyledWrapper>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(13, 17, 23, 0.9)', padding: '40px', borderRadius: '20px', border: '1px solid #333', backdropFilter: 'blur(10px)' }}>
        <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '2px' }}>Clan Management</h1>
        
        <div style={{ marginBottom: '30px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
           <h3 style={{color: '#fff', marginTop: 0}}>Settings</h3>
           <label style={{color: '#ccc', marginRight: '10px'}}>Clans per row (Desktop):</label>
           <input 
             type="number" 
             min="1" 
             max="6" 
             value={clansPerRow} 
             onChange={handleSettingsChange}
             style={{padding: '5px', borderRadius: '4px', border: '1px solid #555', background: '#222', color: '#fff', width: '60px'}}
           />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="#TAG" 
            value={newTag} 
            onChange={(e) => setNewTag(e.target.value.toUpperCase())}
            style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #444', background: '#05060a', color: '#fff', fontSize: '16px' }}
          />
          <button 
            onClick={() => handleAction('add')}
            disabled={loading}
            style={{ padding: '0 30px', background: '#d500f9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 0 15px rgba(213, 0, 249, 0.4)' }}
          >
            {loading ? '...' : 'ADD CLAN'}
          </button>
        </div>

        {msg && <p style={{ textAlign: 'center', marginBottom: '20px', color: msg.includes('failed') || msg.includes('Invalid') ? '#ff5f2e' : '#00e676' }}>{msg}</p>}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tags.map((item, index) => (
            <li key={item.tag} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', background: 'rgba(255,255,255,0.02)', marginBottom: '10px', borderRadius: '8px' }}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>{item.name}</span>
                <span style={{ color: '#888', fontFamily: 'monospace', fontSize: '14px' }}>{item.tag}</span>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={() => moveTag(index, 'up')} disabled={index === 0} style={{cursor: 'pointer', background: 'none', border: 'none', color: '#fff'}}>⬆️</button>
                <button onClick={() => moveTag(index, 'down')} disabled={index === tags.length - 1} style={{cursor: 'pointer', background: 'none', border: 'none', color: '#fff'}}>⬇️</button>
                <button 
                  onClick={() => handleAction('remove', item.tag)}
                  style={{ padding: '8px 16px', background: 'rgba(255, 95, 46, 0.2)', color: '#ff5f2e', border: '1px solid #ff5f2e', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
