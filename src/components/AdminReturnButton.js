import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { login } from '../redux/auth/actions';
import { refreshUserData } from '../utils/userRefresh';
import AuthService from '../services/AuthService';

const AdminReturnButton = () => {
  const dispatch = useDispatch();
  const [isImpersonating, setIsImpersonating] = useState(false);
  console.log("isImpersonating", isImpersonating);
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // Check if user is in impersonation mode using localStorage
    const checkImpersonation = () => {
      try {
        const isImpersonatingFlag = localStorage.getItem('isImpersonating');
        const adminSessionBackup = localStorage.getItem('adminSessionBackup');
        
        if (isImpersonatingFlag === 'true' && adminSessionBackup) {
          const { adminData } = JSON.parse(adminSessionBackup);
          setIsImpersonating(true);
          setAdminEmail(adminData?.email || 'Admin');
          console.log('Impersonation detected from localStorage:', adminData?.email);
        } else {
          setIsImpersonating(false);
          console.log('No impersonation detected');
        }
      } catch (error) {
        console.error('Error checking impersonation status:', error);
        setIsImpersonating(false);
      }
    };

    checkImpersonation();
    
    // Also check every 2 seconds in case impersonation starts while component is mounted
    const interval = setInterval(checkImpersonation, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleReturnToAdmin = async () => {
    setLoading(true);
    try {
      // Get admin session backup from localStorage
      const adminSessionBackup = localStorage.getItem('adminSessionBackup');
      
      if (!adminSessionBackup) {
        throw new Error('No admin session backup found');
      }

      const { accessToken, refreshToken, adminData } = JSON.parse(adminSessionBackup);

      // Restore admin tokens
      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);

      // Update Redux store with the admin user data (like a login action)
      dispatch(login(adminData));

      // Refresh user data to ensure all components have the latest data
      await refreshUserData();

      // Clean up localStorage
      localStorage.removeItem('adminSessionBackup');
      localStorage.removeItem('isImpersonating');

      message.success('Successfully returned to admin account');
      
      // Small delay to ensure all data is updated, then redirect
      setTimeout(() => {
        window.location.href = '/dashboard/admin/users';
      }, 500);
      
    } catch (error) {
      console.error('Error returning to admin:', error);
      
      // Fallback to API call if localStorage fails
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.post(
          `${BASE_URL}/admin/return-from-impersonation`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Cookies.set('accessToken', response.data.accessToken);
        Cookies.set('refreshToken', response.data.refreshToken);
        dispatch(login(response.data.user));
        await refreshUserData();
        
        message.success('Successfully returned to admin account');
        setTimeout(() => {
          window.location.href = '/dashboard/admin/users';
        }, 500);
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
        message.error('Failed to return to admin account');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isImpersonating) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
        padding: '12px 16px',
        border: '2px solid #1890ff',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <UserOutlined style={{ color: '#1890ff' }} />
        <span style={{ fontSize: '14px', color: '#666' }}>
          Viewing as user • Admin: {adminEmail}
        </span>
      </div>
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={handleReturnToAdmin}
        loading={loading}
        size="small"
      >
        Return as Admin
      </Button>
    </div>
  );
};

export default AdminReturnButton;