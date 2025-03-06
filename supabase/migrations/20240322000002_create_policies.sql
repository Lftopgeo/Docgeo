-- RLS Policies

-- Tools policies
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public tools are viewable by everyone" ON tools;
CREATE POLICY "Public tools are viewable by everyone" 
  ON tools FOR SELECT 
  USING (is_public = TRUE);

DROP POLICY IF EXISTS "Users can view their own tools" ON tools;
CREATE POLICY "Users can view their own tools" 
  ON tools FOR SELECT 
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can insert tools" ON tools;
CREATE POLICY "Authenticated users can insert tools" 
  ON tools FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own tools" ON tools;
CREATE POLICY "Users can update their own tools" 
  ON tools FOR UPDATE 
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own tools" ON tools;
CREATE POLICY "Users can delete their own tools" 
  ON tools FOR DELETE 
  USING (created_by = auth.uid());

-- Tool usage stats policies
ALTER TABLE tool_usage_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view usage stats for public tools or their own tools" ON tool_usage_stats;
CREATE POLICY "Users can view usage stats for public tools or their own tools" 
  ON tool_usage_stats FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM tools 
      WHERE tools.id = tool_usage_stats.tool_id 
      AND (tools.is_public = TRUE OR tools.created_by = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authenticated users can insert usage stats" ON tool_usage_stats;
CREATE POLICY "Authenticated users can insert usage stats" 
  ON tool_usage_stats FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Documents policies
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all document categories" ON document_categories;
CREATE POLICY "Users can view all document categories" 
  ON document_categories FOR SELECT 
  USING (TRUE);

DROP POLICY IF EXISTS "Users can view all document subcategories" ON document_subcategories;
CREATE POLICY "Users can view all document subcategories" 
  ON document_subcategories FOR SELECT 
  USING (TRUE);

DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
CREATE POLICY "Users can view their own documents" 
  ON documents FOR SELECT 
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can insert documents" ON documents;
CREATE POLICY "Authenticated users can insert documents" 
  ON documents FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
CREATE POLICY "Users can update their own documents" 
  ON documents FOR UPDATE 
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;
CREATE POLICY "Users can delete their own documents" 
  ON documents FOR DELETE 
  USING (created_by = auth.uid());

-- Tasks policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tasks they created or are assigned to" ON tasks;
CREATE POLICY "Users can view tasks they created or are assigned to" 
  ON tasks FOR SELECT 
  USING (created_by = auth.uid() OR assignee_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can insert tasks" ON tasks;
CREATE POLICY "Authenticated users can insert tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update tasks they created" ON tasks;
CREATE POLICY "Users can update tasks they created" 
  ON tasks FOR UPDATE 
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete tasks they created" ON tasks;
CREATE POLICY "Users can delete tasks they created" 
  ON tasks FOR DELETE 
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can view task tags for tasks they can view" ON task_tags;
CREATE POLICY "Users can view task tags for tasks they can view" 
  ON task_tags FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_tags.task_id 
      AND (tasks.created_by = auth.uid() OR tasks.assignee_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view task comments for tasks they can view" ON task_comments;
CREATE POLICY "Users can view task comments for tasks they can view" 
  ON task_comments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_comments.task_id 
      AND (tasks.created_by = auth.uid() OR tasks.assignee_id = auth.uid())
    )
  );