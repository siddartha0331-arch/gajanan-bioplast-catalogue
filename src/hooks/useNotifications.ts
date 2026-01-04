import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  order_id: string | null;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    setNotifications(data || []);
    setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (!error) {
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
};

// Helper function to create notifications
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string = "info",
  orderId?: string
) => {
  const { error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
      order_id: orderId || null
    });

  if (error) {
    console.error("Error creating notification:", error);
  }
};

// Helper to notify admin about new orders
export const notifyAdminNewOrder = async (orderId: string, customerName: string) => {
  // Get all admin user IDs
  const { data: adminRoles } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  if (adminRoles) {
    for (const admin of adminRoles) {
      await createNotification(
        admin.user_id,
        "New Order Received",
        `${customerName || "A customer"} has placed a new order.`,
        "order",
        orderId
      );
    }
  }
};

// Helper to notify admin about new user signup
export const notifyAdminNewUser = async (userName: string, userEmail: string) => {
  const { data: adminRoles } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  if (adminRoles) {
    for (const admin of adminRoles) {
      await createNotification(
        admin.user_id,
        "New User Registered",
        `${userName || "A new user"} (${userEmail}) has joined.`,
        "user"
      );
    }
  }
};

// Helper to notify admin about quote request
export const notifyAdminQuoteRequest = async (
  customerName: string,
  companyName: string,
  productName: string
) => {
  const { data: adminRoles } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  if (adminRoles) {
    for (const admin of adminRoles) {
      await createNotification(
        admin.user_id,
        "New Quote Request",
        `${customerName}${companyName ? ` (${companyName})` : ""} requested a quote for ${productName}.`,
        "quote"
      );
    }
  }
};

// Helper to notify admin about customization order
export const notifyAdminCustomization = async (
  customerName: string,
  productName: string,
  quantity: number
) => {
  const { data: adminRoles } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  if (adminRoles) {
    for (const admin of adminRoles) {
      await createNotification(
        admin.user_id,
        "New Customization Added",
        `${customerName || "A customer"} added ${productName} (qty: ${quantity}) to cart with customizations.`,
        "customization"
      );
    }
  }
};
