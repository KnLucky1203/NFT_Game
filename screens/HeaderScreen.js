/********************************************************************** The Road to Valhalla! ************************************************************************
 *                                                                                                                                                                   *
 *  📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌           *
 *  📌                                                                                                                                                  📌         *
 *  📌                                                                                                                                                  📌        *
 *  📌     📌            📌    📌📌         📌           📌       📌         📌📌        📌             📌                      📌📌             📌        *
 *  📌      📌          📌    📌  📌        📌           📌       📌        📌  📌       📌             📌                     📌  📌            📌       *
 *  📌       📌        📌    📌    📌       📌           📌       📌       📌    📌      📌             📌                    📌    📌           📌       *
 *  📌        📌      📌    📌      📌      📌           📌       📌      📌      📌     📌             📌                   📌      📌          📌       *
 *  📌         📌    📌    📌📌📌📌📌     📌            📌📌📌📌📌    📌📌📌📌📌    📌              📌                  📌📌📌📌📌         📌       *
 *  📌          📌  📌    📌          📌    📌           📌       📌    📌         📌   📌              📌                 📌          📌        📌       *
 *  📌           📌📌    📌            📌   📌           📌       📌   📌           📌  📌              📌                📌            📌       📌       *
 *  📌            📌    📌              📌  📌📌📌📌📌 📌        📌  📌            📌 📌📌📌📌📌    📌📌📌📌📌📌   📌              📌      📌       *
 *  📌                                                                                                                                                  📌      *
 *  📌                                                                                                                                                  📌      *
 *  📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌      *
 *                                                                                                                                                             *
 *  Project Type  : CrossyGame with NFT management                                                                                                            *
 *   Project ID   : 2024-2                                                                                                                                   *
 *   Client Info  : Private                                                                                                                                 *
 *    Developer   : Rothschild (Nickname)                                                                                                                  *
 *   Source Mode  : 100% Private                                                                                                                          *
 *   Description  : CrossyGame project with NFT as a service.                                                                                            *
 *  Writing Style : P0413-K0408-K1206                                                                                                                   *
 *                                                                                                                                                     *
 ********************************************************************** The Road to Valhalla! *********************************************************
 */

// Sample Libraries
import React, { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, Platform, Dimensions } from 'react-native';
import { myFont } from '../global/myFont';
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'

import { socket, FRONTEND_URL, SERVER_URL, metadata, chains, projectId, solanaConfig } from '../global/global';
import { getWalletSOLBalance, getWalletInfo, getNFTsWithImage, getNFTOne, getAdminData } from '../global/global';
import { deepCopy, jsonUpdate } from '../global/common';
import GameContext from '../context/GameContext';

// Landing Page component
const LoadingScreen = ({ path }) => {

  /* ================================ For Mobile Responsive ===============================*/

  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* ================================ For Mobile Responsive ===============================*/

  const handleOpenMenu = () => {

    setOpenMenu(true);
  };

  const handleCloseMenu = () => {

    setOpenMenu(false);
  };



  // Initial Variables
  const navigation = useNavigation();

  // Personal variables
  const { user, setUser } = React.useContext(GameContext);
  // -- Web3 --
  const [isConnected, setIsConnected] = useState(false);
  const [web3modal, setWeb3Modal] = useState(null);
  const [openNFTDialog, setOpenNFTDialog] = useState(false);
  const { address, chainId } = useWeb3ModalAccount()
  const { walletProvider, connection } = useWeb3ModalProvider()

  useEffect(() => {
    if (walletProvider) {
      handleGetWalletInfo();
      setIsConnected(true)
      if (web3modal) web3modal.close();
    } else {
      setIsConnected(false)
    }
  }, [walletProvider]);
  const onConnectBtnClick = () => {
    if (isConnected) {
      if (web3modal) web3modal.open();
    } else {
      if (web3modal) {
        web3modal.open();
      } else {
        // 3. Create modal
        setWeb3Modal(createWeb3Modal({
          metadata,
          solanaConfig,
          chains,
          projectId,
          enableOnramp: true //set to true by default
        }));
      }
    }
  }
  const handleGetWalletInfo = async () => {
    if (!walletProvider || !address || !`connection`) {
      printConsole('walletProvider or address is undefined');
      return;
    }
    const new_user = deepCopy(user);
    new_user.wallet = walletProvider.publicKey.toBase58()
    await Promise.all([
      getWalletSOLBalance(connection, new_user.wallet).then((balance) => new_user.solAmount = balance / 1e9),
      // getWalletTokenBalance(connection, new_user.wallet, token).then((balance) => new_user.tokenAmount = balance),
      // getNFTswithImage(conn, new_user.wallet).then((nfts) => new_user.nfts = nfts),
      getWalletInfo(new_user.wallet).then((info) => {
        console.log(info)
        new_user.tokenAmount = info.data.tokenAmount;
        new_user.nfts = info.data.nfts;
      })
    ])
    setUser(new_user)
    console.log('new user: ', new_user);
  };

  // --- Admin Dashboard ---
  const [admin, setAdmin] = useState({
    nfts: [],
    taxWallet: '',
    rewardToken: '',
    taxPerUnit: 0
  })
  useEffect(() => {
    if (walletProvider) {
      getAdminData(walletProvider.publicKey.toBase58()).then((data) => {
        setAdmin(data.data);
      })
    } else {

    }
  }, [walletProvider]);

  const setTaxWallet = (text) => {
    let new_admin = deepCopy(admin)
    new_admin.taxWallet = text;
    setAdmin(new_admin);
  }
  const setRewardToken = (text) => {
    let new_admin = deepCopy(admin)
    new_admin.token = text;
    setAdmin(new_admin);
  }
  const setPerUnit = (text) => {
    let new_admin = deepCopy(admin)
    new_admin.tokenPerUnit = Number(text);
    setAdmin(new_admin);
  }
  const [newNFT, setNewNFT] = useState('');
  const addNewNFT = () => {
    getNFTOne(newNFT).then((nft) => {
      let new_admin = deepCopy(admin)
      if (!new_admin.nfts)
        new_admin.nfts = [];
      new_admin.nfts.push(nft)
      setAdmin(new_admin);
    })
  }

  return (
    <View style={{
      width: '100%',
      height: '100px',
      minHeight: '100px',
      minHeight: '100px',
      display: 'flex',
      flexDirection: 'row',
      background: 'black',
      borderBottom: '1px solid white',
      zIndex: 5000,
    }}>
      <View style={{
        width: '100px', height: '100px',
        borderRight: '1px solid white',
      }}>
        <Image source={require("../assets/crossy_logo.png")}
          style={{
            width: 75, height: 75,
            margin: 'auto',
            cursor: 'pointer'
          }}
          onClick={() => {
            navigation.navigate("LandingScreen");
          }}
        />
      </View>
      <View style={{
        position: 'relative',
        background: 'black',
        color: 'white',
        width: 'calc(100vw - 100px)',
        display: 'flex', flexDirection: 'row',
        justifyContent: 'end',
        alignItems: 'center',
        columnGap: '12px',
        paddingRight: '20px'
      }}>
        {isPC &&
          <>
            <Text style={{
              fontFamily: myFont,
              fontSize: '20px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'home' ? 'rgba(239, 88, 123, 1)' : 'white',
            }}
              onClick={() => {
                navigation.navigate("LandingScreen");
              }}
            >
              Home
            </Text>
            <Text style={{
              fontFamily: myFont,
              fontSize: '20px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'guide' ? 'rgba(239, 88, 123, 1)' : 'white',
            }}
              onClick={() => {
                navigation.navigate("GuideScreen");
              }}
            >
              How to Play
            </Text>
            <Text style={{
              fontFamily: myFont,
              fontSize: '20px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'leaderboard' ? 'rgba(239, 88, 123, 1)' : 'white',
            }}
              onClick={() => {
                navigation.navigate("LeaderboardScreen");
              }}
            >
              Leaderboard
            </Text>
            <Text style={{
              fontFamily: myFont,
              fontSize: '20px',
              padding: '10px',
              background: 'rgba(239, 88, 123, 1)',
              boxShadow: '0px 3px 10px red',
              borderRadius: '20px',
              cursor: 'pointer',
              color: 'white'
            }}
              onClick={() => {
                onConnectBtnClick();
              }}>
              {address ? address.substring(0, 4) + '...' + address.substring(address.length - 4) : 'Connect Wallet'}
            </Text>
          </>
        }
        {isMobile &&
          (openMenu ?
            <View style={{
              padding: '10px',
              cursor: 'pointer',

              zIndex: '5000'
            }}
              onClick={handleCloseMenu} >
              <Text style={{
                fontFamily: myFont,
                color: 'rgba(239, 88, 123, 1)',
              }}>Close</Text>
            </View> :
            <View style={{
              padding: '10px',
              cursor: 'pointer',
              zIndex: '5000'
            }}
              onClick={handleOpenMenu} >
              <Text style={{ color: 'white', fontFamily: myFont }}>Menu</Text>
            </View>)
        }
      </View>
      {openMenu &&
        <>
          <View style={{

            width: '100vw',
            height: 'calc(100vh - 100px)',
            zIndex: '1',
            position: 'absolute',
            top: '100px',
            background: 'black'
          }}>
            <Image source={require("../assets/crossy_logo.png")}
              style={{
                width: '100%', height: '100%',
                filter: 'grayscale(1)',
                opacity: '0.3',
              }}
            />

          </View>
          <View
            style={{
              display: 'flex', flexDirection: 'column',
              zIndex: '6000',
              width: '100vw',
              height: 'calc(100vh - 100px)',
              position: 'absolute',
              top: '100px',
              color: 'white',
              margin: 'auto',
              justifyContent: 'center',
              rowGap: '50px',
              alignItems: 'center',
              fontSize: '32px',
              letterSpacing: '3px'
            }}>

            <Text style={{
              fontFamily: myFont,
              fontSize: '32px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'home' ? 'rgba(239, 88, 123, 1)' : 'white',
              fontWeight: '900',
            }}
              onClick={() => {
                navigation.navigate("LandingScreen");
                handleCloseMenu();
              }}
            >
              Home
            </Text>
            <Text style={{
              fontFamily: myFont,
              fontSize: '32px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'guide' ? 'rgba(239, 88, 123, 1)' : 'white',
            }}
              onClick={() => {
                navigation.navigate("GuideScreen");
              }}
            >
              How to Play
            </Text>
            <Text style={{
              fontFamily: myFont,
              fontSize: '32px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'leaderboard' ? 'rgba(239, 88, 123, 1)' : 'white',
            }}
              onClick={() => {
                navigation.navigate("LeaderboardScreen");
              }}
            >
              Leaderboard
            </Text>
            <Text style={{
              fontFamily: myFont,
              fontSize: '32px',
              padding: '10px',
              background: 'rgba(239, 88, 123, 1)',
              boxShadow: '0px 3px 10px red',
              borderRadius: '20px',
              cursor: 'pointer',
              color: 'white'
            }}
              onClick={() => {
                onConnectBtnClick();
              }}>
              {address ? address.substring(0, 4) + '...' + address.substring(address.length - 4) : 'Connect Wallet'}
            </Text>
          </View>
        </>
      }
    </View >
  );
};

export default LoadingScreen;

