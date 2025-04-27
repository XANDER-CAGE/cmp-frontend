// src/contexts/RingCentralContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import http from '../utils/axiosInterceptors';
import { toast } from 'react-toastify';
import { useUserInfo } from './UserInfoContext';

// Create the RingCentral context
const RingCentralContext = createContext();

export const RingCentralProvider = ({ children }) => {
  const { userInfo } = useUserInfo();
  const [isConnected, setIsConnected] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [activeCalls, setActiveCalls] = useState([]);
  const [callStatus, setCallStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize RingCentral connection
  useEffect(() => {
    if (userInfo?.id) {
      initializeRingCentral();
    }
  }, [userInfo]);

  // Check connection status periodically
  useEffect(() => {
    if (isConnected) {
      const intervalId = setInterval(() => {
        checkConnectionStatus();
      }, 60000); // Check every minute
      
      return () => clearInterval(intervalId);
    }
  }, [isConnected]);

  // Initialize RingCentral connection
  const initializeRingCentral = async () => {
    try {
      setIsLoading(true);
      const response = await http.get('RingCentral/status');
      
      if (response?.success) {
        setIsConnected(response.data.isConnected);
        setDeviceId(response.data.deviceId);
      } else {
        setIsConnected(false);
        setDeviceId(null);
      }
    } catch (error) {
      console.error('Error initializing RingCentral:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check connection status
  const checkConnectionStatus = async () => {
    try {
      const response = await http.get('RingCentral/status');
      
      if (response?.success) {
        setIsConnected(response.data.isConnected);
        setDeviceId(response.data.deviceId);
      } else {
        setIsConnected(false);
        setDeviceId(null);
      }
    } catch (error) {
      console.error('Error checking RingCentral status:', error);
      setIsConnected(false);
    }
  };

  // Make an outbound call
  const makeCall = async (phoneNumber) => {
    if (!isConnected || !deviceId) {
      toast.error('RingCentral not connected or device not available');
      return null;
    }

    try {
      setIsLoading(true);
      
      const callData = {
        from: {
          deviceId: deviceId
        },
        to: {
          phoneNumber: phoneNumber
        }
      };
      
      const response = await http.post('RingCentral/call-out', callData);
      
      if (response?.success) {
        const sessionId = response.data.session.id;
        
        // Update active calls
        setActiveCalls(prev => [...prev, {
          sessionId,
          phoneNumber,
          status: 'Setup',
          startTime: new Date()
        }]);
        
        // Set call status
        setCallStatus(prev => ({
          ...prev,
          [sessionId]: {
            status: 'Setup',
            phoneNumber
          }
        }));
        
        toast.success(`Calling ${phoneNumber}...`);
        return sessionId;
      } else {
        toast.error(response.error || 'Failed to make call');
        return null;
      }
    } catch (error) {
      console.error('Error making call:', error);
      toast.error(error?.response?.data?.error || 'Error making call');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get call session status
  const getCallStatus = async (sessionId) => {
    if (!isConnected || !sessionId) {
      return null;
    }

    try {
      const response = await http.get(`RingCentral/call-status/${sessionId}`);
      
      if (response?.success) {
        // Update call status
        const newStatus = response.data.parties[0]?.status?.code || 'Unknown';
        
        setCallStatus(prev => ({
          ...prev,
          [sessionId]: {
            ...prev[sessionId],
            status: newStatus
          }
        }));
        
        // Update active calls list
        setActiveCalls(prev => 
          prev.map(call => 
            call.sessionId === sessionId 
              ? { ...call, status: newStatus } 
              : call
          )
        );
        
        return newStatus;
      }
      return null;
    } catch (error) {
      console.error('Error getting call status:', error);
      return null;
    }
  };

  // End call
  const endCall = async (sessionId) => {
    if (!isConnected || !sessionId) {
      return false;
    }

    try {
      setIsLoading(true);
      const response = await http.delete(`RingCentral/call-session/${sessionId}`);
      
      if (response?.success) {
        // Update active calls by removing the ended call
        setActiveCalls(prev => prev.filter(call => call.sessionId !== sessionId));
        
        // Remove from call status
        setCallStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[sessionId];
          return newStatus;
        });
        
        toast.success('Call ended successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to end call');
        return false;
      }
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error(error?.response?.data?.error || 'Error ending call');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Hold call
  const holdCall = async (sessionId, partyId) => {
    if (!isConnected || !sessionId || !partyId) {
      return false;
    }

    try {
      setIsLoading(true);
      const response = await http.post(`RingCentral/hold-call/${sessionId}/parties/${partyId}`);
      
      if (response?.success) {
        // Update call status
        setCallStatus(prev => ({
          ...prev,
          [sessionId]: {
            ...prev[sessionId],
            status: 'Hold',
            isOnHold: true
          }
        }));
        
        // Update active calls
        setActiveCalls(prev => 
          prev.map(call => 
            call.sessionId === sessionId 
              ? { ...call, status: 'Hold', isOnHold: true } 
              : call
          )
        );
        
        toast.success('Call placed on hold');
        return true;
      } else {
        toast.error(response.error || 'Failed to hold call');
        return false;
      }
    } catch (error) {
      console.error('Error holding call:', error);
      toast.error(error?.response?.data?.error || 'Error holding call');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Unhold call
  const unholdCall = async (sessionId, partyId) => {
    if (!isConnected || !sessionId || !partyId) {
      return false;
    }

    try {
      setIsLoading(true);
      const response = await http.post(`RingCentral/unhold-call/${sessionId}/parties/${partyId}`);
      
      if (response?.success) {
        // Update call status
        setCallStatus(prev => ({
          ...prev,
          [sessionId]: {
            ...prev[sessionId],
            status: 'Active',
            isOnHold: false
          }
        }));
        
        // Update active calls
        setActiveCalls(prev => 
          prev.map(call => 
            call.sessionId === sessionId 
              ? { ...call, status: 'Active', isOnHold: false } 
              : call
          )
        );
        
        toast.success('Call resumed');
        return true;
      } else {
        toast.error(response.error || 'Failed to resume call');
        return false;
      }
    } catch (error) {
      console.error('Error resuming call:', error);
      toast.error(error?.response?.data?.error || 'Error resuming call');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Value to be provided by the context
  const contextValue = {
    isConnected,
    deviceId,
    activeCalls,
    callStatus,
    isLoading,
    makeCall,
    getCallStatus,
    endCall,
    holdCall,
    unholdCall,
    refreshStatus: initializeRingCentral
  };

  return (
    <RingCentralContext.Provider value={contextValue}>
      {children}
    </RingCentralContext.Provider>
  );
};

// Custom hook for using the RingCentral context
export const useRingCentral = () => {
  const context = useContext(RingCentralContext);
  if (!context) {
    throw new Error('useRingCentral must be used within a RingCentralProvider');
  }
  return context;
};

export default RingCentralContext;