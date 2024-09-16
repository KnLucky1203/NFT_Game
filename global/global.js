import axios from "axios"
import io from 'socket.io-client';

// Global variables : MBC-on mobile responsive
export const FRONTEND_URL = "http://192.168.140.55:19006";
// export const FRONTEND_URL = "https://valhalla.proskillowner.com";
export const SERVER_URL = "https://bundleontron.tech";  // TODO: replace with your own server URL
export const socket = io(SERVER_URL);

// =========================================== WEB3 ======================================================
// --- Web3 Modal Import ---
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@web3modal/solana/chains'

// --- Web3Modal Connect Settings ---
export const chains = [solana, solanaTestnet, solanaDevnet]
export const projectId = 'dcf293e3b464df32cd09530f8f8bf63d';  // TODO: replace with your own projectId
export const metadata = {
  name: 'Appkit Solana Example',
  description: 'Appkit Solana Example',
  url: 'https://appkit-solana.vercel.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};
export const solanaConfig = defaultSolanaConfig({
  metadata,
  chains,
  projectId,
  auth: {
    email: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github', 'apple', 'facebook'],
    walletFeatures: true, //set to true by default
    showWallets: true //set to true by default
  }
});

// --- Web3 API ---
export const getNFTswithImage = async (wallet) => {
  return await axios(SERVER_URL + '/api/nft_images/' + wallet)
}

export const getWalletInfo = async (wallet) => {
  console.log('getWalletInfo', wallet)
  return await axios(SERVER_URL + '/api/wallet_info/' + wallet)
}

export const getNFTOne = async (mint) => {
  console.log('getNFTOne', mint)
  return await axios(SERVER_URL + '/api/nft_one/' + mint)
}

export const getAdminData = async (wallet) => {
  console.log('getAdminData', wallet)
  return await axios(SERVER_URL + '/api/admin_data/' + wallet)
}

export const getWalletSOLBalance_bn = async (conn, wallet) => {
  try {
    let balance = await conn.getBalance(new PublicKey(wallet));
    return balance;
  } catch (error) {
    // G.log(error);
  }
  return BigInt(0);
};

export const getWalletSOLBalance = async (conn, wallet) => {
  try {
    let balance = (await conn.getBalance(new PublicKey(wallet))) / LAMPORTS_PER_SOL;
    return balance;
  } catch (error) {
    // G.log(error);
  }
  return 0;
};
// =========================================== /WEB3 ======================================================

export const registerUser = async (username, password) => {
  return await axios.post(SERVER_URL + '/api/v1/auth/register', {
    username, password
  })
}

export const loginUser = async (username, password) => {
  return await axios.post(SERVER_URL + '/api/v1/auth/login', {
    username, password
  })
}

export const getScoreList = async (sortBy, limit, page) => {
  return await axios.get(SERVER_URL + '/api/v1/user/score/list?sortBy='+sortBy+'&limit='+limit+"&page="+page);
}

export const getRate = async (sortBy, limit, page) => {
  return await axios.get(SERVER_URL + '/api/v1/base/reward/rate?mode=PVE');
}

export const setrate = async (rate) => {
  return await axios.patch(SERVER_URL + '/api/v1/admin/reward/rate',{rate},  {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
}

export const getUserInfo = async (token) => {
  return await axios.get(SERVER_URL + '/api/v1/user/info',  {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
}

export const updateScore = async (score, wallet, token) => {
  return await axios.post(SERVER_URL + '/api/v1/user/score/update',{score, wallet},  {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
}
