/**
 * Home page for creating and joining rooms
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsApi } from '../services/api';

export const Home = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('python');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await roomsApi.createRoom(language);
      navigate(`/room/${response.room_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
      setIsCreating(false);
    }
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }
    navigate(`/room/${roomId.trim()}`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '40px',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
        }}>
          Pair Programming
        </h1>

        <p style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: '#666',
        }}>
          Collaborate in real-time with other developers
        </p>

        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            border: '1px solid #f5c6cb',
          }}>
            {error}
          </div>
        )}

        {/* Create Room Section */}
        <div style={{
          marginBottom: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid #dee2e6',
        }}>
          <h2 style={{
            fontSize: '20px',
            marginBottom: '20px',
            color: '#333',
          }}>
            Create a New Room
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#555',
              fontSize: '14px',
            }}>
              Programming Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
            </select>
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isCreating ? 'not-allowed' : 'pointer',
              opacity: isCreating ? 0.6 : 1,
            }}
          >
            {isCreating ? 'Creating...' : 'Create Room'}
          </button>
        </div>

        {/* Join Room Section */}
        <div>
          <h2 style={{
            fontSize: '20px',
            marginBottom: '20px',
            color: '#333',
          }}>
            Join an Existing Room
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#555',
              fontSize: '14px',
            }}>
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleJoinRoom();
                }
              }}
            />
          </div>

          <button
            onClick={handleJoinRoom}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Join Room
          </button>
        </div>
      </div>

      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        color: '#6c757d',
        fontSize: '14px',
      }}>
        Real-time collaborative coding with WebSocket support
      </div>
    </div>
  );
};
