import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../src/redux/auth/selectors';
import Notifications from '../../src/pages/Dashboard/Notifications';
import ThemeOne from '../../src/pages/Dashboard/ThemeOne';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationsPage = () => {
  const user = useSelector(selectUser);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'HomeIcon',
      current: false,
    },
    {
      name: 'Notifications',
      href: '/dashboard/notifications',
      icon: BellIcon,
      current: true,
    },
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
  ];

  return (
    <ThemeOne
      navigation={navigation}
      userNavigation={userNavigation}
    >
      <Notifications />
    </ThemeOne>
  );
};

export default NotificationsPage;
