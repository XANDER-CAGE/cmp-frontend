// src/components/PhoneButton/index.js
import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Popover, Badge, Space } from 'antd';
import { 
  PhoneOutlined, 
  CloseCircleOutlined, 
  PauseCircleOutlined,
  PlayCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useRingCentral } from '../../contexts/RingCentralContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';
import './phone-button.css';

const PhoneButton = ({ phoneNumber, size = 'default', showText = false }) => {
  const { language } = useLanguage();
  const { 
    isConnected, 
    deviceId,
    makeCall, 
    endCall, 
    holdCall,
    unholdCall,
    getCallStatus, 
    callStatus,
    isLoading: contextLoading
  } = useRingCentral();
  
  const [localLoading, setLocalLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [partyId, setPartyId] = useState(null);
  const [showPopover, setShowPopover] = useState(false);

  // Check if there's an active call for this phone number
  const findActiveCall = () => {
    if (!callStatus || !phoneNumber) return null;
    
    const activeSessionId = Object.keys(callStatus).find(sid => 
      callStatus[sid].phoneNumber === phoneNumber
    );
    
    return activeSessionId ? { 
      sessionId: activeSessionId, 
      status: callStatus[activeSessionId] 
    } : null;
  };

  // Get current active call
  const activeCall = findActiveCall();
  
  // Update call status periodically if there's an active call
  useEffect(() => {
    if (sessionId && isConnected) {
      const interval = setInterval(() => {
        getCallStatus(sessionId);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [sessionId, getCallStatus, isConnected]);
  
  // Handle making a call
  const handleCall = async () => {
    if (!isConnected || !deviceId) {
      return;
    }

    if (activeCall) {
      // If there's already a call to this number, show popover with call controls
      setSessionId(activeCall.sessionId);
      
      // The party ID is typically the session ID + "-1" for the first party
      if (!partyId) {
        setPartyId(`${activeCall.sessionId}-1`);
      }
      
      setShowPopover(true);
    } else {
      // Otherwise, initiate a new call
      setLocalLoading(true);
      try {
        const newSessionId = await makeCall(phoneNumber);
        if (newSessionId) {
          setSessionId(newSessionId);
          setPartyId(`${newSessionId}-1`); // Typically the first party ID
          setShowPopover(true);
        }
      } finally {
        setLocalLoading(false);
      }
    }
  };

  // Handle ending a call
  const handleEndCall = async () => {
    if (sessionId) {
      setLocalLoading(true);
      try {
        await endCall(sessionId);
        setSessionId(null);
        setPartyId(null);
        setShowPopover(false);
      } finally {
        setLocalLoading(false);
      }
    }
  };

  // Handle putting a call on hold
  const handleHoldCall = async () => {
    if (sessionId && partyId) {
      setLocalLoading(true);
      try {
        await holdCall(sessionId, partyId);
      } finally {
        setLocalLoading(false);
      }
    }
  };

  // Handle taking a call off hold
  const handleUnholdCall = async () => {
    if (sessionId && partyId) {
      setLocalLoading(true);
      try {
        await unholdCall(sessionId, partyId);
      } finally {
        setLocalLoading(false);
      }
    }
  };

  // Get call status for display
  const getCallStatusDisplay = () => {
    if (!activeCall) return null;
    
    const status = activeCall.status.status;
    switch (status) {
      case 'Setup':
        return t(translations, 'calling', language);
      case 'Proceeding':
        return t(translations, 'connecting', language);
      case 'Answered':
      case 'Active':
        return t(translations, 'inCall', language);
      case 'Hold':
        return t(translations, 'onHold', language);
      default:
        return status;
    }
  };

  // Determine button appearance based on call status
  const getButtonType = () => {
    if (!isConnected) return 'default';
    if (activeCall) {
      const status = activeCall.status.status;
      if (status === 'Hold') return 'default';
      return 'primary';
    }
    return 'primary';
  };

  // Call control popover content
  const popoverContent = (
    <Space direction="vertical" size="small" className="phone-button-popover">
      <div>{t(translations, 'callStatus', language)}: <strong>{getCallStatusDisplay()}</strong></div>
      <Space>
        {activeCall && activeCall.status.status === 'Hold' ? (
          <Button 
            type="primary" 
            icon={<PlayCircleOutlined />} 
            onClick={handleUnholdCall}
            size="small"
            loading={localLoading}
          >
            {t(translations, 'resume', language)}
          </Button>
        ) : (
          <Button 
            icon={<PauseCircleOutlined />} 
            onClick={handleHoldCall}
            size="small"
            loading={localLoading}
            disabled={!activeCall || ['Setup', 'Proceeding'].includes(activeCall.status.status)}
          >
            {t(translations, 'hold', language)}
          </Button>
        )}
        <Button 
          danger 
          icon={<CloseCircleOutlined />} 
          onClick={handleEndCall}
          size="small"
          loading={localLoading}
        >
          {t(translations, 'end', language)}
        </Button>
      </Space>
    </Space>
  );

  // For cases when telephony is not connected
  if (!isConnected) {
    return (
      <Tooltip title={t(translations, 'telephonyNotAvailable', language)}>
        <Button 
          type="default" 
          icon={<PhoneOutlined />} 
          size={size}
          disabled
          className="phone-button"
        >
          {showText && t(translations, 'call', language)}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Popover
      content={popoverContent}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{t(translations, 'callControls', language)}</span>
          <span>{phoneNumber}</span>
        </div>
      }
      trigger="click"
      open={showPopover && !!sessionId}
      onOpenChange={setShowPopover}
    >
      <Badge dot={!!activeCall} offset={[-5, 0]}>
        <Button
          type={getButtonType()}
          icon={contextLoading || localLoading ? <LoadingOutlined /> : <PhoneOutlined />}
          onClick={handleCall}
          size={size}
          className="phone-button"
        >
          {showText && t(translations, 'call', language)}
        </Button>
      </Badge>
    </Popover>
  );
};

export default PhoneButton;