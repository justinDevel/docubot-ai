import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { 
  Upload, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Filter,
  Clock,
  Eye,
  Trash2,
  Download,
  Bot,
  TrendingUp,
  Users,
  Activity,
  Key,
  Copy,
  RefreshCw
} from 'lucide-react';
import { uploadDocument, getUserDocuments, deleteDocument, DocumentInfo } from '../lib/api';
import { useApiKeys } from '../lib/auth';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { generateApiKey, getApiKeys, revokeApiKey } = useApiKeys();
  const [apiKeys, setApiKeys] = useState(getApiKeys());

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getUserDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (files) => {
      if (files.length === 0) return;
      
      setUploading(true);
      const file = files[0];
      
      try {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Remove data:type;base64, prefix
          };
          reader.readAsDataURL(file);
        });

        const response = await uploadDocument({
          fileName: file.name,
          fileType: file.type,
          content: base64
        });

        toast.success('Document uploaded successfully!');
        loadDocuments(); // Refresh the list
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload document');
      } finally {
        setUploading(false);
      }
    }
  });

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await deleteDocument(documentId);
      toast.success('Document deleted successfully');
      loadDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleGenerateApiKey = async () => {
    const name = prompt('Enter a name for this API key:');
    if (!name) return;

    try {
      const newKey = await generateApiKey(name);
      setApiKeys(getApiKeys());
      toast.success('API key generated successfully!');
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    }
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard!');
  };

  const stats = [
    { label: 'Total Documents', value: documents.length.toString(), icon: FileText, change: '+2 this month' },
    { label: 'Total Chats', value: documents.reduce((sum, doc) => sum + (doc.insights ? 1 : 0), 0).toString(), icon: MessageCircle, change: '+15% vs last month' },
    { label: 'Active Keys', value: apiKeys.filter(key => key.isActive).length.toString(), icon: Key, change: `${apiKeys.length} total` },
    { label: 'Processing', value: documents.filter(doc => doc.status === 'processing').length.toString(), icon: Activity, change: 'Real-time updates' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your documents...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600">Manage your documents and API integrations</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('documents')}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Upload Document</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm border border-slate-200">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'api-keys', label: 'API Keys', icon: Key },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-success-600 mt-1">{stat.change}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-primary-100 to-accent-100 rounded-lg">
                      <stat.icon className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Documents</h3>
                <div className="space-y-4">
                  {documents.slice(0, 3).map((doc) => (
                    <div key={doc.documentId} className="flex items-center space-x-4">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{doc.fileName}</p>
                        <p className="text-sm text-slate-600">
                          {Math.round(doc.size / 1024)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'processed' 
                          ? 'bg-success-100 text-success-800' 
                          : doc.status === 'processing'
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {doc.status}
                      </div>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No documents uploaded yet</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="w-full text-left p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg hover:from-primary-100 hover:to-accent-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Upload className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-medium text-slate-900">Upload Document</p>
                        <p className="text-sm text-slate-600">Add a new PDF, DOCX, or TXT file</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('api-keys')}
                    className="w-full text-left p-3 bg-gradient-to-r from-accent-50 to-purple-50 rounded-lg hover:from-accent-100 hover:to-purple-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-accent-600" />
                      <div>
                        <p className="font-medium text-slate-900">Generate API Key</p>
                        <p className="text-sm text-slate-600">Create keys for SDK integration</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'documents' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                isDragActive 
                  ? 'border-primary-400 bg-primary-50' 
                  : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-primary-50'
              } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full inline-block mb-4">
                {uploading ? (
                  <RefreshCw className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-white" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {uploading ? 'Uploading...' : isDragActive ? 'Drop files here' : 'Upload Documents'}
              </h3>
              <p className="text-slate-600">
                {uploading 
                  ? 'Processing your document with AWS Lambda...'
                  : 'Drag & drop PDF, DOCX, or TXT files here, or click to browse'
                }
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Maximum file size: 10MB
              </p>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Your Documents</h3>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                      <Filter className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {documents.map((doc) => (
                  <div key={doc.documentId} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <FileText className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{doc.fileName}</h4>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                            <span>{Math.round(doc.size / 1024)} KB</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                          {doc.insights && (
                            <div className="mt-2">
                              <p className="text-sm text-slate-700">{doc.insights.summary}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {doc.insights.keyEntities.slice(0, 3).map((entity) => (
                                  <span
                                    key={entity}
                                    className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                                  >
                                    {entity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'processed' 
                            ? 'bg-success-100 text-success-800' 
                            : doc.status === 'processing'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {doc.status}
                        </div>
                        <div className="flex items-center space-x-1">
                          {doc.status === 'processed' && (
                            <Link to={`/chat/${doc.documentId}`}>
                              <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                              </button>
                            </Link>
                          )}
                          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDocument(doc.documentId)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="p-12 text-center">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No documents yet</h3>
                    <p className="text-slate-600">Upload your first document to get started</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'api-keys' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* API Keys Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">API Keys</h3>
                  <p className="text-slate-600">Manage your API keys for SDK integration</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateApiKey}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Generate Key</span>
                </motion.button>
              </div>

              {/* API Keys List */}
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-slate-900">{key.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            key.isActive 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {key.isActive ? 'Active' : 'Revoked'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-white px-2 py-1 rounded border font-mono">
                            {key.key.substring(0, 20)}...
                          </code>
                          <button 
                            onClick={() => handleCopyApiKey(key.key)}
                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Created {new Date(key.createdAt).toLocaleDateString()}
                          {key.lastUsed && ` • Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                        </p>
                      </div>
                      {key.isActive && (
                        <button 
                          onClick={() => revokeApiKey(key.id)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {apiKeys.length === 0 && (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No API keys yet</h3>
                    <p className="text-slate-600">Generate your first API key to start using the SDK</p>
                  </div>
                )}
              </div>
            </div>

            {/* SDK Implementation Guide */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">SDK Implementation</h3>
              <div className="bg-slate-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
                <div className="space-y-2">
                  <div className="text-slate-500">// Add to your website</div>
                  <div>&lt;script src="https://cdn.docubot.ai/sdk.js"&gt;&lt;/script&gt;</div>
                  <div>&lt;script&gt;</div>
                  <div className="ml-4">
                    DocuBot.init({'{'}
                    <div className="ml-4">
                      <div>apiKey: "{apiKeys.find(k => k.isActive)?.key || 'your_api_key'}",</div>
                      <div>documentId: "{documents[0]?.documentId || 'doc_abc123'}",</div>
                      <div>theme: "light",</div>
                      <div>position: "bottom-right"</div>
                    </div>
                    {'}'});
                  </div>
                  <div>&lt;/script&gt;</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AWS Configuration */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">AWS Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      AWS Region
                    </label>
                    <input
                      type="text"
                      value={import.meta.env.VITE_AWS_REGION || 'us-east-1'}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      S3 Bucket
                    </label>
                    <input
                      type="text"
                      value={import.meta.env.VITE_S3_BUCKET_NAME || 'docubot-documents'}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      API Gateway URL
                    </label>
                    <input
                      type="url"
                      value={import.meta.env.VITE_API_GATEWAY_URL || 'https://api.docubot.ai'}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Widget Settings */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Widget Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Default Theme
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Position
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>Bottom Right</option>
                      <option>Bottom Left</option>
                      <option>Top Right</option>
                      <option>Top Left</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Allow File Upload</span>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary-600 transition-colors duration-200 ease-in-out focus:outline-none">
                      <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;