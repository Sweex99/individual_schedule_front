import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as S from './AppHeader.styles';
import { useAuth } from '../../../../Context/useAuth';
import { getNotifications, markNotificationAsRead } from '../../../../Services/NotificationService';

interface Notification {
  id: number;
  text: string;
  read: boolean;
}

export const AppHeader = () => {
  const currentUser = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const response = await getNotifications();
    setNotifications(response);
    setUnreadCount(response.filter((n: { read: any; }) => !n.read).length)
  };

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentUser, unreadCount]);

  return (
    <S.Root>
      <S.LeftItems>
        <S.NavLink to="/">🏠 Головна</S.NavLink>
        {currentUser?.user?.type === 'Admin' && (
          <S.NavLink to="/settings">⚙️ Налаштування</S.NavLink>
        )}
      </S.LeftItems>

      <S.RightItems>
        {currentUser?.user && (
          <>
            <div>
              👤 {currentUser.user.type} обліковий запис —{' '}
              <Link to="/account">
                {currentUser.user.first_name} {currentUser.user.last_name}
              </Link>
            </div>

            <S.NotificationWrapper ref={dropdownRef}>
              <S.NotificationIcon onClick={() => setOpenDropdown(!openDropdown)}>
                🔔 {unreadCount > 0 && <S.NotificationBadge>{unreadCount}</S.NotificationBadge>}
              </S.NotificationIcon>
              {openDropdown && (
                <S.NotificationDropdown>
                  {notifications.length === 0 ? (
                    <S.NotificationItem>Немає повідомлень</S.NotificationItem>
                  ) : (
                    notifications.map((notif) => (
                      <S.NotificationItem
                        key={notif.id}
                        $unread={!notif.read}
                        onMouseEnter={async () => {
                          if (!notif.read) {
                            try {
                              await markNotificationAsRead(notif.id);
                              setNotifications((prev) => {
                                const updated = prev.map((n) =>
                                  n.id === notif.id ? { ...n, read: true } : n
                                );
                                const unread = updated.filter(n => !n.read).length;
                                setUnreadCount(unread);
                                return updated;
                              });
                            } catch (e) {
                              console.error("Помилка оновлення сповіщення:", e);
                            }
                          }
                        }}
                      >
                        {notif.text}
                      </S.NotificationItem>
                    ))
                  )}
                </S.NotificationDropdown>
              )}
            </S.NotificationWrapper>

            <S.LogoutButton onClick={currentUser.logout}>🚪 Вийти</S.LogoutButton>
          </>
        )}
      </S.RightItems>
    </S.Root>
  );
};
