-- Create Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('call', 'invite', 'review', 'email', 'sign')), -- limit types for consistency
  due_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'dismissed')),
  entity_id UUID, -- distinct ID of related deal or company
  entity_type TEXT CHECK (entity_type IN ('deal', 'company', 'syndicate')),
  action_url TEXT, -- link to perform action
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Seed some initial tasks for the demo if empty
INSERT INTO tasks (user_id, title, type, due_date, priority, entity_type)
SELECT 
  auth.uid(),
  'Call with Stears (Demo)',
  'call',
  NOW() + INTERVAL '2 hours',
  'high',
  'company'
WHERE NOT EXISTS (SELECT 1 FROM tasks);
