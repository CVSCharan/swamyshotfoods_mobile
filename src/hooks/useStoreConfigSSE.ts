import { useEffect, useRef } from 'react';
import EventSource, { EventSourceListener } from 'react-native-sse';
import { useStoreConfigStore } from '../stores/useStoreConfigStore';
import { config } from '../config/env';

// Use the configured API base URL for SSE connection
const SSE_URL = `${config.apiBaseUrl.replace('/api', '')}/api/store-config/sse`;
const RECONNECT_DELAY = 3000;

export const useStoreConfigSSE = () => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setConfig, setConnected, setError } = useStoreConfigStore();

  const connect = () => {
    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      console.log('🔌 Connecting to SSE:', SSE_URL);
      const eventSource = new EventSource(SSE_URL);
      eventSourceRef.current = eventSource;

      const handleOpen: EventSourceListener = event => {
        console.log('✅ SSE Connected');
        setConnected(true);
        setError(null);
      };

      const handleMessage: EventSourceListener = event => {
        try {
          // react-native-sse returns data in event.data
          if (event.data) {
            const data = JSON.parse(event.data);
            console.log('📦 SSE Data received:', data);
            setConfig(data);
          }
        } catch (err) {
          console.error('❌ Failed to parse SSE data:', err);
          setError('Failed to parse server data');
        }
      };

      const handleError: EventSourceListener = event => {
        console.error('❌ SSE Error:', event);
        setConnected(false);
        setError('Connection lost. Reconnecting...');

        // Close and attempt reconnect
        eventSource.close();
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connect();
        }, RECONNECT_DELAY);
      };

      eventSource.addEventListener('open', handleOpen);
      eventSource.addEventListener('message', handleMessage);
      eventSource.addEventListener('error', handleError);

      return () => {
        eventSource.removeAllEventListeners();
        eventSource.close();
      };
    } catch (err) {
      console.error('❌ Failed to create EventSource:', err);
      setError('Failed to connect to server');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setConnected(false);
      console.log('🔌 SSE Disconnected');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return { disconnect, connect };
};
