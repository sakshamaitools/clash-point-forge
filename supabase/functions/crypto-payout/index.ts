
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { tournament_id, winner_id, prize_amount, currency_type = 'USDC' } = await req.json();

    // Get winner's crypto wallet
    const { data: wallet, error: walletError } = await supabaseClient
      .from('crypto_wallets')
      .select('wallet_address, wallet_type')
      .eq('user_id', winner_id)
      .eq('is_verified', true)
      .single();

    if (walletError || !wallet) {
      throw new Error('No verified wallet found for winner');
    }

    // Simulate crypto transaction (in real app, integrate with Web3 provider)
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Record transaction
    await supabaseClient
      .from('transactions')
      .insert({
        user_id: winner_id,
        tournament_id,
        amount: prize_amount,
        transaction_type: 'crypto_payout',
        payment_status: 'completed',
        stripe_payment_intent_id: transactionHash,
        processed_at: new Date().toISOString()
      });

    // Update platform currency
    await supabaseClient
      .from('platform_currency')
      .upsert({
        user_id: winner_id,
        balance: prize_amount,
        total_earned: prize_amount,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    // Mint NFT reward for tournament winner
    await supabaseClient
      .from('nft_rewards')
      .insert({
        tournament_id,
        winner_id,
        nft_name: `Tournament Champion #${Date.now()}`,
        nft_description: `Winner of tournament ${tournament_id}`,
        rarity: 'legendary',
        metadata_url: `https://api.example.com/nft/${Date.now()}`,
        token_id: `winner_${tournament_id}_${Date.now()}`,
        contract_address: '0x1234567890abcdef'
      });

    return new Response(JSON.stringify({ 
      success: true,
      transaction_hash: transactionHash,
      wallet_address: wallet.wallet_address,
      amount: prize_amount,
      currency: currency_type,
      nft_minted: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing crypto payout:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
