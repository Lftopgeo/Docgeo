import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { cn } from "../../lib/utils";
import {
  Activity,
  Calendar,
  Clock,
  Code,
  Edit,
  ExternalLink,
  FileText,
  Info,
  Link,
  Settings,
  Share2,
  Shield,
  Zap,
} from "lucide-react";

interface ToolDetailsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  tool?: {
    id: string;
    name: string;
    description: string;
    status: "active" | "maintenance";
    category: string;
    lastUpdated: string;
    imageUrl: string;
    apiEndpoint?: string;
    documentation?: string;
    usageStats?: {
      requests: number;
      successRate: number;
      averageResponseTime: number;
    };
    integrations?: string[];
    permissions?: string[];
    createdAt?: string;
  };
  onEdit?: () => void;
  onShare?: () => void;
}

const ToolDetailsDialog = ({
  open = true,
  onOpenChange = () => {},
  tool = {
    id: "tool-1",
    name: "AI Assistant",
    description:
      "Powerful AI assistant for answering questions and completing tasks with natural language processing capabilities. Supports multiple languages and can be integrated with various platforms.",
    status: "active",
    category: "Fast Processing",
    lastUpdated: "2 days ago",
    imageUrl:
      "https://images.unsplash.com/photo-1677442135968-6bd241f26c68?w=300&q=80",
    apiEndpoint: "https://api.example.com/ai-assistant",
    documentation: "https://docs.example.com/ai-assistant",
    usageStats: {
      requests: 15420,
      successRate: 98.7,
      averageResponseTime: 0.8,
    },
    integrations: ["Slack", "Microsoft Teams", "Discord", "Email"],
    permissions: [
      "Read user data",
      "Process natural language",
      "Generate responses",
    ],
    createdAt: "2023-06-15",
  },
  onEdit = () => {},
  onShare = () => {},
}: ToolDetailsDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {tool.name}
              </DialogTitle>
              <DialogDescription className="text-gray-400 flex items-center gap-2 mt-1">
                <span>{tool.category}</span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {tool.lastUpdated}
                </span>
              </DialogDescription>
            </div>
            <Badge
              variant={tool.status === "active" ? "default" : "secondary"}
              className={`${tool.status === "active" ? "bg-green-600" : "bg-amber-600"} px-3 py-1`}
            >
              {tool.status === "active" ? "Active" : "Maintenance"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start border-b border-gray-800 bg-transparent p-0 h-12">
              <TabsTrigger
                value="overview"
                className={cn(
                  "data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12",
                  "px-6",
                )}
              >
                <Info className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="usage"
                className={cn(
                  "data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12",
                  "px-6",
                )}
              >
                <Activity className="mr-2 h-4 w-4" />
                Usage Stats
              </TabsTrigger>
              <TabsTrigger
                value="integration"
                className={cn(
                  "data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12",
                  "px-6",
                )}
              >
                <Link className="mr-2 h-4 w-4" />
                Integration
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className={cn(
                  "data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12",
                  "px-6",
                )}
              >
                <Shield className="mr-2 h-4 w-4" />
                Permissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-300">{tool.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Features</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Natural language processing with high accuracy</li>
                      <li>Multi-language support (40+ languages)</li>
                      <li>Context-aware responses</li>
                      <li>Customizable behavior and response styles</li>
                      <li>Real-time processing with low latency</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                        <div>
                          <p className="font-medium">Created</p>
                          <p className="text-sm text-gray-400">
                            {tool.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <div>
                          <p className="font-medium">Last Updated</p>
                          <p className="text-sm text-gray-400">
                            {tool.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        </div>
                        <div>
                          <p className="font-medium">
                            Next Scheduled Maintenance
                          </p>
                          <p className="text-sm text-gray-400">In 2 weeks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3">Quick Links</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a
                          href={tool.documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="mr-2 h-4 w-4" /> Documentation
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a
                          href={tool.apiEndpoint}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Code className="mr-2 h-4 w-4" /> API Reference
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Calendar className="mr-2 h-4 w-4" /> Usage Schedule
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Settings className="mr-2 h-4 w-4" /> Configuration
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3">Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">API Status</span>
                        <Badge
                          variant="outline"
                          className="bg-green-900/30 text-green-400"
                        >
                          Operational
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Response Time</span>
                        <span className="text-gray-300">
                          {tool.usageStats?.averageResponseTime}s
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Success Rate</span>
                        <span className="text-gray-300">
                          {tool.usageStats?.successRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">
                      Total Requests
                    </h3>
                    <p className="text-2xl font-bold">
                      {tool.usageStats?.requests.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-400 mt-1">
                      +12.5% from last month
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">
                      Success Rate
                    </h3>
                    <p className="text-2xl font-bold">
                      {tool.usageStats?.successRate}%
                    </p>
                    <p className="text-sm text-green-400 mt-1">
                      +0.3% from last month
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">
                      Avg. Response Time
                    </h3>
                    <p className="text-2xl font-bold">
                      {tool.usageStats?.averageResponseTime}s
                    </p>
                    <p className="text-sm text-green-400 mt-1">
                      -0.1s from last month
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Usage Over Time</h3>
                  <div className="h-64 flex items-center justify-center border border-gray-700 rounded-lg">
                    <p className="text-gray-400">
                      Usage chart would be displayed here
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Top Users</h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 border-b border-gray-700 last:border-0"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-700 mr-3 overflow-hidden">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                              alt="User avatar"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">User {i}</p>
                            <p className="text-xs text-gray-400">
                              user{i}@example.com
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {Math.floor(Math.random() * 1000) + 500} requests
                          </p>
                          <p className="text-xs text-gray-400">
                            Last used {Math.floor(Math.random() * 24) + 1}h ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">API Endpoint</h3>
                  <div className="bg-gray-800 p-3 rounded-md font-mono text-sm flex justify-between items-center">
                    <code>{tool.apiEndpoint}</code>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Integrated Platforms
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tool.integrations?.map((integration, index) => (
                      <div
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg flex items-center"
                      >
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <Zap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{integration}</p>
                          <p className="text-xs text-gray-400">
                            Connected • Active
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Sample Code</h3>
                  <div className="bg-gray-800 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <pre className="text-gray-300">
                      {`// JavaScript Example
const response = await fetch('${tool.apiEndpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    prompt: 'What is artificial intelligence?',
    max_tokens: 100
  })
});

const data = await response.json();
console.log(data.response);`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Webhooks</h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300 mb-3">
                      Configure webhooks to receive real-time updates when
                      events occur.
                    </p>
                    <Button variant="outline">
                      <Link className="mr-2 h-4 w-4" /> Configure Webhooks
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Required Permissions
                  </h3>
                  <div className="space-y-3">
                    {tool.permissions?.map((permission, index) => (
                      <div
                        key={index}
                        className="bg-gray-800 p-3 rounded-lg flex items-center"
                      >
                        <div className="h-8 w-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                          <Shield className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">{permission}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Data Usage Policy
                  </h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300 mb-2">
                      This tool processes user data according to our data usage
                      policy. All data is encrypted in transit and at rest.
                    </p>
                    <p className="text-gray-300 mb-3">
                      User data is retained for 30 days before being
                      automatically deleted unless otherwise specified in your
                      settings.
                    </p>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" /> View Full Policy
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Access Control</h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300 mb-3">
                      Manage which users and teams have access to this AI tool.
                    </p>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" /> Configure Access
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="border-t border-gray-800 pt-4 mt-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onOpenChange.bind(null, false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button
                onClick={onEdit}
                className="bg-[#FF6B00] hover:bg-[#FF8C3F] text-white"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Tool
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToolDetailsDialog;
