import { useEffect, useRef, useState } from 'react';
import EventSource, { EventSourceListener } from 'react-native-sse';
import { useStoreConfigStore } from '../stores/useStoreConfigStore';
import { config } from '../config/env';
import { storeConfigService } from '../services/storeConfigService';

// Construct SSE URL properly
const SSE_URL = `${config.apiBaseUrl}/store-config/sse`;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds
const MAX_RETRIES = 5; // Maximum reconnection attempts (matching frontend)
const SSE_CONNECTION_DELAY = 500; // Delay before establishing SSE (matching frontend)

/**
 * Hybrid SSE Hook
 *
 * Phase 1: Fetch initial data via REST API for instant display
 * Phase 2: Establish SSE connection for real-time updates
 *
 * This approach provides:
 * - Fast initial load (no waiting for SSE connection)
 * - Real-time updates (SSE keeps data fresh)
 * - Resilient fallback (works even if SSE fails)
 */
export const useStoreConfigSSE = () => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const sseDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const [reconnectDelay, setReconnectDelay] = useState(INITIAL_RECONNECT_DELAY);

  const { setConfig, setConnected, setError } = useStoreConfigStore();

  /**
   * Phase 1: Fetch initial data via REST API
   * This provides instant data without waiting for SSE connection
   */
  const fetchInitialData = async () => {
    try {
      console.log('📡 Fetching initial store config via REST...');
      const data = await storeConfigService.get();
      setConfig(data);
      console.log('✅ Initial data loaded successfully');
    } catch (err) {
      console.error('❌ Failed to fetch initial data:', err);
      setError('Failed to load initial data');
    }
  };

  const calculateBackoff = (attempt: number): number => {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (max)
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(2, attempt),
      MAX_RECONNECT_DELAY,
    );
    return delay;
  };

  /**
   * Phase 2: Establish SSE connection for real-time updates
   */
  const connect = () => {
    // Close existing connection if any
    if (eventSourceRef.current) {
      try {
        eventSourceRef.current.removeAllEventListeners();
        eventSourceRef.current.close();
      } catch (err) {
        console.error('Error closing existing connection:', err);
      }
      eventSourceRef.current = null;
    }

    // Check if we've exceeded max retries
    if (reconnectAttempts.current >= MAX_RETRIES) {
      console.error('❌ Max reconnection attempts reached. Giving up.');
      setError('Unable to establish live connection. Using cached data.');
      setConnected(false);
      return;
    }

    try {
      console.log(
        `🔌 Connecting to SSE (attempt ${
          reconnectAttempts.current + 1
        }/${MAX_RETRIES}):`,
        SSE_URL,
      );
      const eventSource = new EventSource(SSE_URL, {
        headers: {
          Accept: 'text/event-stream',
        },
      });
      eventSourceRef.current = eventSource;

      const handleOpen: EventSourceListener = event => {
        console.log('✅ SSE Connected - Live updates active');
        setConnected(true);
        setError(null);
        // Reset reconnection attempts on successful connection
        reconnectAttempts.current = 0;
        setReconnectDelay(INITIAL_RECONNECT_DELAY);
      };

      const handleMessage: EventSourceListener = event => {
        try {
          if ('data' in event && event.data) {
            const data = JSON.parse(event.data as string);
            console.log('📦 SSE Update received:', data);
            setConfig(data);
            // Ensure we're marked as connected when receiving data
            setConnected(true);
            setError(null);
          }
        } catch (err) {
          console.error('❌ Failed to parse SSE data:', err);
          setError('Failed to parse server data');
        }
      };

      const handleError: EventSourceListener = event => {
        console.error('❌ SSE Error:', event);
        setConnected(false);

        // Close the connection
        if (eventSourceRef.current) {
          try {
            eventSourceRef.current.removeAllEventListeners();
            eventSourceRef.current.close();
          } catch (err) {
            console.error('Error during error handler cleanup:', err);
          }
          eventSourceRef.current = null;
        }

        // Increment retry counter
        reconnectAttempts.current += 1;

        // Calculate backoff delay
        const delay = calculateBackoff(reconnectAttempts.current - 1);
        setReconnectDelay(delay);

        if (reconnectAttempts.current < MAX_RETRIES) {
          setError(
            `Live connection lost. Reconnecting in ${Math.round(
              delay / 1000,
            )}s...`,
          );

          // Schedule reconnection
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `🔄 Attempting to reconnect (${reconnectAttempts.current}/${MAX_RETRIES})...`,
            );
            connect();
          }, delay);
        } else {
          setError('Unable to establish live connection. Using cached data.');
        }
      };

      eventSource.addEventListener('open', handleOpen);
      eventSource.addEventListener('message', handleMessage);
      eventSource.addEventListener('error', handleError);
    } catch (err) {
      console.error('❌ Failed to create EventSource:', err);
      setError('Failed to connect to server');
      setConnected(false);
    }
  };

  const disconnect = () => {
    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Clear SSE delay timeout
    if (sseDelayTimeoutRef.current) {
      clearTimeout(sseDelayTimeoutRef.current);
      sseDelayTimeoutRef.current = null;
    }

    // Close the connection
    if (eventSourceRef.current) {
      try {
        eventSourceRef.current.removeAllEventListeners();
        eventSourceRef.current.close();
      } catch (err) {
        console.error('Error during disconnect:', err);
      }
      eventSourceRef.current = null;
    }

    setConnected(false);
    console.log('🔌 SSE Disconnected');
  };

  useEffect(() => {
    // Phase 1: Fetch initial data immediately
    fetchInitialData();

    // Phase 2: Establish SSE connection after delay
    sseDelayTimeoutRef.current = setTimeout(() => {
      console.log('⏱️ Starting SSE connection after initial load...');
      connect();
    }, SSE_CONNECTION_DELAY);

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  return { disconnect, connect };
};
