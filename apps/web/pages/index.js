import { useState, useEffect } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const [feed, setFeed] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const [showDetail, setShowDetail] = useState(null);

  const API = '/api';

  useEffect(() => {
    const saved = localStorage.getItem('bs-user');
    if (saved) setUser(JSON.parse(saved));
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const res = await fetch(`${API}/photos`);
      const data = await res.json();
      setFeed(data);
    } catch (err) {
      console.error('Erro ao carregar feed', err);
    }
  };

  const handleCreateUser = async () => {
    if (!name.trim() || !nickname.trim()) return alert('Preenche nome e nickname');
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, nickname })
    });
    const newUser = await res.json();
    localStorage.setItem('bs-user', JSON.stringify(newUser));
    setUser(newUser);
    setName('');
    setNickname('');
  };

  const handleUpload = async () => {
    if (!file) return alert('Escolhe uma imagem');
    const form = new FormData();
    form.append('file', file);
    form.append('message', message);
    const res = await fetch(`${API}/photos?userId=${user.id}`, { method: 'POST', body: form });
    if (!res.ok) {
      console.error('Upload falhou:', await res.text());
      return alert('Erro ao enviar imagem');
    }
    setFile(null);
    setMessage('');
    setShowModal(false);
    loadFeed();
  };

  if (!user) {
    return (
      <div className="container">
        <h1>Criar Utilizador</h1>
        <div className="card setup">
          <input placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} />
          <button onClick={handleCreateUser}>Criar Utilizador</button>
        </div>
        <style jsx>{`
          .container {
            padding: 16px;
            font-family: sans-serif;
            background: #e0f7fa;
            min-height: 100vh;
          }
          .card.setup {
            background: white;
            padding: 16px;
            border-radius: 12px;
            margin: 32px auto;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 16px;
            width: 100%;
            box-sizing: border-box;
          }
          button {
            padding: 12px;
            background: #03a9f4;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>Chá de Bebé do Bernardo</h1>
        <button className="new-post-btn" onClick={() => setShowModal(true)}>➕ Novo Post</button>
      </header>

      <section className="feed">
        {feed.map(item => (
          <div key={item.id} className="card" onClick={() => setShowDetail(item)}>
            <img src={item.url} alt="foto" />
            <div className="nickname">@{item.nickname}</div>
            {item.message && (
              <div className="message">
                📩 {item.message.slice(0, 100)}
                {item.message.length > 100 && '...'}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Modal de criar post */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Novo Post</h2>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <textarea
              placeholder="Escreve a tua mensagem"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleUpload}>Enviar</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalhe do post */}
      {showDetail && (
        <div className="modal-backdrop" onClick={() => setShowDetail(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={showDetail.url} alt="foto" style={{ borderRadius: '8px', maxWidth: '100%' }} />
            <div className="nickname">@{showDetail.nickname}</div>
            <div className="message-full">{showDetail.message}</div>
            <button className="close-btn" onClick={() => setShowDetail(null)}>Fechar</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 16px;
          font-family: sans-serif;
          background: #e0f7fa;
          min-height: 100vh;
        }
        header {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }
        header h1 {
          margin: 0;
          font-size: 24px;
        }
        .new-post-btn {
          padding: 10px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
          max-width: 200px;
        }
        .feed {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .feed {
            grid-template-columns: 1fr 1fr;
          }
        }
        .card {
          background: white;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: pointer;
          word-break: break-word;
        }
        .card img {
          width: 100%;
          border-radius: 4px;
          object-fit: cover;
        }
        .nickname {
          font-weight: bold;
          font-size: 16px;
        }
        .message, .message-full {
          font-style: italic;
          color: #555;
          text-align: left;
          font-size: 14px;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        .modal-content input,
        .modal-content textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }
        .modal-content textarea {
          resize: vertical;
          min-height: 80px;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }
        .modal-buttons button {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }
        .modal-buttons .cancel {
          background: #f44336;
          color: white;
        }
        .modal-buttons button:not(.cancel) {
          background: #03a9f4;
          color: white;
        }
        .close-btn {
          padding: 10px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
