-- Clean up existing structures (Optional: remove if you want to keep data)
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS approvals CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS approval_status CASCADE;

-- Enums
CREATE TYPE user_role AS ENUM ('Admin', 'Manager', 'Member');
CREATE TYPE task_status AS ENUM ('Pending', 'In Progress', 'Review', 'Completed');
CREATE TYPE task_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE approval_status AS ENUM ('Pending', 'Approved', 'Rejected');

-- Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'Member' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'Pending' NOT NULL,
  priority task_priority DEFAULT 'Medium' NOT NULL,
  due_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approvals Table
CREATE TABLE approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  level user_role NOT NULL, -- Manager or Admin level approval
  status approval_status DEFAULT 'Pending' NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_id UUID, -- Can be task_id or other entity ID
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Comments Table
CREATE TABLE task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tasks are viewable by everyone" ON tasks FOR SELECT USING (true);
CREATE POLICY "Creators can insert tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Owners and staff can update tasks" ON tasks FOR UPDATE USING (
  auth.uid() = creator_id OR 
  auth.uid() = assignee_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Admin', 'Manager'))
);
CREATE POLICY "Admins can delete tasks" ON tasks FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
);

ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approvals are viewable by everyone" ON approvals FOR SELECT USING (true);
CREATE POLICY "Managers and Admins can handle approvals" ON approvals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Admin', 'Manager'))
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Logs are viewable by everyone" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert logs" ON activity_logs FOR INSERT WITH CHECK (true);

ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON task_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON task_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions & Triggers

-- Automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role;
BEGIN
  -- Safe role assignment with fallback
  BEGIN
    assigned_role := (new.raw_user_meta_data->>'role')::user_role;
  EXCEPTION WHEN others THEN
    assigned_role := 'Member';
  END;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    COALESCE(assigned_role, 'Member')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the function is accessible
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Check if trigger exists before creating
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Activity Logging Trigger for Tasks
CREATE OR REPLACE FUNCTION public.log_task_activity()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO activity_logs (user_id, action, target_id, details)
        VALUES (current_user_id, 'CREATE_TASK', NEW.id, jsonb_build_object('title', NEW.title));
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO activity_logs (user_id, action, target_id, details)
        VALUES (current_user_id, 'UPDATE_TASK', NEW.id, jsonb_build_object('changes', jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)));
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO activity_logs (user_id, action, target_id, details)
        VALUES (current_user_id, 'DELETE_TASK', OLD.id, jsonb_build_object('title', OLD.title));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_log_task_activity ON tasks;
CREATE TRIGGER tr_log_task_activity
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW EXECUTE PROCEDURE public.log_task_activity();
