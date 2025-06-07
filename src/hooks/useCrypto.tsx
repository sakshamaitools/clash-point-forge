
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CryptoWallet {
  id: string;
  user_id: string;
  wallet_address: string;
  wallet_type: string;
  is_verified: boolean;
  created_at: string;
}

interface PlatformCurrency {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  updated_at: string;
}

export const useCrypto = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [currency, setCurrency] = useState<PlatformCurrency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWallets();
      fetchCurrency();
    }
  }, [user]);

  const fetchWallets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const fetchCurrency = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('platform_currency')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCurrency(data);
    } catch (error) {
      console.error('Error fetching currency:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async (walletType: string) => {
    if (!user) return;

    try {
      if (walletType === 'metamask' && typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];

        const { error } = await supabase
          .from('crypto_wallets')
          .insert({
            user_id: user.id,
            wallet_address: walletAddress,
            wallet_type: walletType,
            is_verified: true
          });

        if (error) throw error;

        toast({
          title: "Wallet Connected",
          description: `${walletType} wallet connected successfully`,
        });

        fetchWallets();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const addCurrency = async (amount: number, type: 'earned' | 'purchased') => {
    if (!user || !currency) return;

    try {
      const newBalance = currency.balance + amount;
      const newTotalEarned = type === 'earned' ? currency.total_earned + amount : currency.total_earned;

      const { error } = await supabase
        .from('platform_currency')
        .update({
          balance: newBalance,
          total_earned: newTotalEarned,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      fetchCurrency();
    } catch (error) {
      console.error('Error adding currency:', error);
    }
  };

  const spendCurrency = async (amount: number) => {
    if (!user || !currency || currency.balance < amount) return false;

    try {
      const newBalance = currency.balance - amount;
      const newTotalSpent = currency.total_spent + amount;

      const { error } = await supabase
        .from('platform_currency')
        .update({
          balance: newBalance,
          total_spent: newTotalSpent,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      fetchCurrency();
      return true;
    } catch (error) {
      console.error('Error spending currency:', error);
      return false;
    }
  };

  return {
    wallets,
    currency,
    loading,
    connectWallet,
    addCurrency,
    spendCurrency,
    refetch: () => {
      fetchWallets();
      fetchCurrency();
    }
  };
};
