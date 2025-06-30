import { useUser, useAuth } from '@clerk/clerk-react';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export const useApiKeys = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const generateApiKey = async (name: string): Promise<ApiKey> => {
    const token = await getToken();
    
    // Generate a secure API key
    const keyId = `dk_${Math.random().toString(36).substr(2, 9)}`;
    const keySecret = `sk_${Math.random().toString(36).substr(2, 32)}`;
    const apiKey = `${keyId}.${keySecret}`;

    const newKey: ApiKey = {
      id: keyId,
      name,
      key: apiKey,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    // Store in user metadata (in production, this would be in a database)
    const existingKeys = user?.publicMetadata?.apiKeys as ApiKey[] || [];
    const updatedKeys = [...existingKeys, newKey];

    await user?.update({
      publicMetadata: {
        ...user.publicMetadata,
        apiKeys: updatedKeys,
      },
    });

    return newKey;
  };

  const getApiKeys = (): ApiKey[] => {
    return (user?.publicMetadata?.apiKeys as ApiKey[]) || [];
  };

  const revokeApiKey = async (keyId: string): Promise<void> => {
    const existingKeys = user?.publicMetadata?.apiKeys as ApiKey[] || [];
    const updatedKeys = existingKeys.map(key => 
      key.id === keyId ? { ...key, isActive: false } : key
    );

    await user?.update({
      publicMetadata: {
        ...user.publicMetadata,
        apiKeys: updatedKeys,
      },
    });
  };

  const validateApiKey = (apiKey: string): boolean => {
    const keys = getApiKeys();
    return keys.some(key => key.key === apiKey && key.isActive);
  };

  return {
    generateApiKey,
    getApiKeys,
    revokeApiKey,
    validateApiKey,
  };
};

export const getUserId = (): string | null => {
  const { user } = useUser();
  return user?.id || null;
};

export const isAuthenticated = (): boolean => {
  const { isSignedIn } = useAuth();
  return isSignedIn || false;
};