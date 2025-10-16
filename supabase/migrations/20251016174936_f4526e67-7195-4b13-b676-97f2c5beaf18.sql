-- Add expected completion date to orders table
ALTER TABLE public.orders
ADD COLUMN expected_completion_date timestamp with time zone,
ADD COLUMN delivery_days integer;