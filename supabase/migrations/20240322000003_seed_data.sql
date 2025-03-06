-- Seed data for AI Tools Dashboard

-- Insert sample tools
INSERT INTO tools (id, name, description, status, category, image_url, api_endpoint, documentation, is_public)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'AI Assistant', 'Powerful AI assistant for answering questions and completing tasks with natural language processing capabilities.', 'active', 'Fast Processing', 'https://images.unsplash.com/photo-1677442135968-6bd241f26c68?w=300&q=80', 'https://api.example.com/ai-assistant', 'https://docs.example.com/ai-assistant', TRUE),
  ('00000000-0000-0000-0000-000000000002', 'Image Generator', 'Create stunning images from text descriptions using advanced AI models.', 'active', 'Creative Suite', 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=300&q=80', 'https://api.example.com/image-generator', 'https://docs.example.com/image-generator', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'Code Analyzer', 'Analyze and optimize your code with AI-powered suggestions and bug detection.', 'maintenance', 'Smart Coding', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&q=80', 'https://api.example.com/code-analyzer', 'https://docs.example.com/code-analyzer', TRUE),
  ('00000000-0000-0000-0000-000000000004', 'Data Visualizer', 'Transform complex data into intuitive visualizations with AI assistance.', 'active', 'Fast Processing', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80', 'https://api.example.com/data-visualizer', 'https://docs.example.com/data-visualizer', TRUE),
  ('00000000-0000-0000-0000-000000000005', 'Content Writer', 'Generate high-quality content for blogs, articles, and marketing materials.', 'active', 'Creative Suite', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=80', 'https://api.example.com/content-writer', 'https://docs.example.com/content-writer', TRUE),
  ('00000000-0000-0000-0000-000000000006', 'Voice Transcriber', 'Convert audio to text with high accuracy using advanced speech recognition.', 'maintenance', 'Fast Processing', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&q=80', 'https://api.example.com/voice-transcriber', 'https://docs.example.com/voice-transcriber', TRUE);

-- Insert sample tool usage stats
INSERT INTO tool_usage_stats (tool_id, requests, success_rate, average_response_time)
VALUES
  ('00000000-0000-0000-0000-000000000001', 15420, 98.7, 0.8),
  ('00000000-0000-0000-0000-000000000002', 8750, 97.2, 1.2),
  ('00000000-0000-0000-0000-000000000003', 6320, 95.8, 0.9),
  ('00000000-0000-0000-0000-000000000004', 9840, 99.1, 0.7),
  ('00000000-0000-0000-0000-000000000005', 12680, 98.3, 1.0),
  ('00000000-0000-0000-0000-000000000006', 7450, 96.5, 1.5);

-- Insert sample tool integrations
INSERT INTO tool_integrations (tool_id, integration_name)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Slack'),
  ('00000000-0000-0000-0000-000000000001', 'Microsoft Teams'),
  ('00000000-0000-0000-0000-000000000001', 'Discord'),
  ('00000000-0000-0000-0000-000000000001', 'Email'),
  ('00000000-0000-0000-0000-000000000002', 'Adobe Creative Cloud'),
  ('00000000-0000-0000-0000-000000000002', 'Figma'),
  ('00000000-0000-0000-0000-000000000003', 'GitHub'),
  ('00000000-0000-0000-0000-000000000003', 'VS Code'),
  ('00000000-0000-0000-0000-000000000004', 'Tableau'),
  ('00000000-0000-0000-0000-000000000004', 'Power BI'),
  ('00000000-0000-0000-0000-000000000005', 'WordPress'),
  ('00000000-0000-0000-0000-000000000005', 'Google Docs'),
  ('00000000-0000-0000-0000-000000000006', 'Zoom'),
  ('00000000-0000-0000-0000-000000000006', 'Google Meet');

-- Insert sample document categories
INSERT INTO document_categories (id, name)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'Projects'),
  ('00000000-0000-0000-0000-000000000102', 'Research'),
  ('00000000-0000-0000-0000-000000000103', 'Technical'),
  ('00000000-0000-0000-0000-000000000104', 'Marketing');

-- Insert sample document subcategories
INSERT INTO document_subcategories (id, category_id, name)
VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Requirements'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 'Proposals'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000101', 'Timelines'),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', 'User Studies'),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000102', 'Market Analysis'),
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000102', 'Competitive Research'),
  ('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000103', 'API'),
  ('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000103', 'Architecture'),
  ('00000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000103', 'Security'),
  ('00000000-0000-0000-0000-000000000210', '00000000-0000-0000-0000-000000000104', 'Strategy'),
  ('00000000-0000-0000-0000-000000000211', '00000000-0000-0000-0000-000000000104', 'Content'),
  ('00000000-0000-0000-0000-000000000212', '00000000-0000-0000-0000-000000000104', 'Analytics');

-- Insert sample documents
INSERT INTO documents (id, title, description, category_id, subcategory_id, file_type, file_size)
VALUES
  ('00000000-0000-0000-0000-000000000301', 'Project Requirements', 'Detailed requirements for the AI assistant project', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', 'PDF', '2.4 MB'),
  ('00000000-0000-0000-0000-000000000302', 'User Research', 'User research findings for the new dashboard', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000204', 'DOCX', '1.8 MB'),
  ('00000000-0000-0000-0000-000000000303', 'API Documentation', 'Complete API documentation for the platform', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000207', 'HTML', '5.2 MB'),
  ('00000000-0000-0000-0000-000000000304', 'Marketing Plan', 'Q3 marketing strategy and execution plan', '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000210', 'PPTX', '4.7 MB');