/**
 * Room page for collaborative coding
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import { useWebSocket } from '../hooks/useWebSocket';
import { roomsApi } from '../services/api';

export const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sendCodeUpdate } = useWebSocket(roomId);

  // Verify room exists on mount
  useEffect(() => {
    if (!roomId) {
      setError('No room ID provided');
      setLoading(false);
      return;
    }

    const verifyRoom = async () => {
      try {
        await roomsApi.getRoom(roomId);
        setLoading(false);
      } catch (err: any) {
        console.error('Error verifying room:', err);
        setError(err.response?.data?.detail || 'Room not found');
        setLoading(false);
      }
    };

    verifyRoom();
  }, [roomId]);

  const handleCodeChange = (code: string) => {
    // Send code update to WebSocket
    sendCodeUpdate(code);
  };

  const handleLeaveRoom = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1e1e1e',
        color: 'white',
      }}>
        <div>Loading room...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1e1e1e',
        color: 'white',
      }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button
          onClick={handleLeaveRoom}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#2d2d30',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '20px',
        }}>
          Pair Programming
        </h1>
        <button
          onClick={handleLeaveRoom}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Leave Room
        </button>
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        {roomId && (
          <CodeEditor
            roomId={roomId}
            onCodeChange={handleCodeChange}
          />
        )}
      </div>
    </div>
  );
};
