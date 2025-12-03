-- Create order_messages table for admin-customer communication
CREATE TABLE public.order_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages where they are sender or recipient
CREATE POLICY "Users can view own messages"
ON public.order_messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can send messages (insert)
CREATE POLICY "Users can send messages"
ON public.order_messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Users can mark messages as read if they are recipient
CREATE POLICY "Recipients can update read status"
ON public.order_messages
FOR UPDATE
USING (auth.uid() = recipient_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;