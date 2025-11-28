/**
 * Custom hook for WebSocket connection management
 */
import { useEffect, useCallback, useRef } from 'react';
import { wsService } from '../services/websocket';
import { useAppDispatch } from './useRedux';
import { setCode, setLanguage, setActiveUsers, setConnected } from '../store/editorSlice';
import type { WebSocketMessage } from '../types';

export const useWebSocket = (roomId: string | undefined) => {
  const dispatch = useAppDispatch();
  const dispatchRef = useRef(dispatch);

  // Keep dispatch ref updated
  useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'init':
        // Initial state from server
        if (message.code) dispatchRef.current(setCode(message.code));
        if (message.language) dispatchRef.current(setLanguage(message.language));
        if (message.active_users !== undefined) dispatchRef.current(setActiveUsers(message.active_users));
        dispatchRef.current(setConnected(true));
        break;

      case 'code_update':
        // Code update from another user
        if (message.code) {
          dispatchRef.current(setCode(message.code));
        }
        break;

      case 'user_joined':
      case 'user_left':
        // Update active users count
        if (message.active_users !== undefined) {
          dispatchRef.current(setActiveUsers(message.active_users));
        }
        break;

      case 'cursor_position':
        // Handle cursor position updates from other users
        // This could be used to show remote cursors
        console.log('Cursor position update:', message);
        break;

      case 'pong':
        // Handle pong response
        break;

      default:
        console.log('Unknown message type:', message);
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;

    // Connect to WebSocket
    wsService.connect(roomId)
      .then(() => {
        console.log('Connected to room:', roomId);
      })
      .catch((error) => {
        console.error('Failed to connect to WebSocket:', error);
        dispatchRef.current(setConnected(false));
      });

    // Register message handler
    wsService.onMessage(handleMessage);

    // Cleanup on unmount
    return () => {
      wsService.offMessage(handleMessage);
      wsService.disconnect();
      dispatchRef.current(setConnected(false));
    };
  }, [roomId, handleMessage]);

  return {
    sendCodeUpdate: wsService.sendCodeUpdate.bind(wsService),
    sendCursorPosition: wsService.sendCursorPosition.bind(wsService),
    isConnected: wsService.isConnected.bind(wsService),
  };
};
