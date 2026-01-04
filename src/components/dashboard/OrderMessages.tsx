import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { createNotification } from "@/hooks/useNotifications";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  order_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface OrderMessagesProps {
  orderId: string;
  currentUserId: string;
  otherUserId?: string;
  otherUserName?: string;
  isAdmin: boolean;
}

const OrderMessages = ({
  orderId,
  currentUserId,
  otherUserId: initialOtherUserId,
  otherUserName,
  isAdmin,
}: OrderMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [otherUserId, setOtherUserId] = useState(initialOtherUserId || "");

  // For customers, fetch an admin to message using security definer function
  useEffect(() => {
    const fetchAdminId = async () => {
      if (!isAdmin && !initialOtherUserId) {
        const { data, error } = await supabase
          .rpc("get_admin_user_id");
        
        if (data && !error) {
          setOtherUserId(data);
        }
      }
    };
    fetchAdminId();
  }, [isAdmin, initialOtherUserId]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("order_messages")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
      const unread = data?.filter(
        (m) => m.recipient_id === currentUserId && !m.is_read
      ).length || 0;
      setUnreadCount(unread);
    }
    setLoading(false);
  };

  const markMessagesAsRead = async () => {
    const unreadMessages = messages.filter(
      (m) => m.recipient_id === currentUserId && !m.is_read
    );
    
    if (unreadMessages.length === 0) return;

    const { error } = await supabase
      .from("order_messages")
      .update({ is_read: true })
      .eq("order_id", orderId)
      .eq("recipient_id", currentUserId)
      .eq("is_read", false);

    if (!error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.recipient_id === currentUserId ? { ...m, is_read: true } : m
        )
      );
      setUnreadCount(0);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    if (!otherUserId) {
      toast.error("Unable to send message - no recipient found");
      return;
    }

    setSending(true);
    const { error } = await supabase.from("order_messages").insert({
      order_id: orderId,
      sender_id: currentUserId,
      recipient_id: otherUserId,
      message: newMessage.trim(),
    });

    if (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } else {
      setNewMessage("");
      toast.success("Message sent");
      
      // Send notification to recipient
      const senderType = isAdmin ? "Admin" : "Customer";
      await createNotification(
        otherUserId,
        `New message from ${senderType}`,
        newMessage.trim().substring(0, 100) + (newMessage.length > 100 ? "..." : ""),
        "order",
        orderId
      );
      
      fetchMessages();
    }
    setSending(false);
  };

  useEffect(() => {
    if (open) {
      fetchMessages();
      markMessagesAsRead();
    }
  }, [open, orderId]);

  // Subscribe to realtime messages
  useEffect(() => {
    const channel = supabase
      .channel(`order-messages-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "order_messages",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          if (newMsg.recipient_id === currentUserId && open) {
            markMessagesAsRead();
          } else if (newMsg.recipient_id === currentUserId) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    // Initial fetch for unread count
    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, currentUserId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <MessageCircle className="w-4 h-4 mr-1" />
          Messages
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? `Message to ${otherUserName || "Customer"}` : "Messages from Admin"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-1 pr-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-3 py-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === currentUserId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.sender_id === currentUserId
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender_id === currentUserId
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex gap-2 pt-4 border-t mt-2">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderMessages;
