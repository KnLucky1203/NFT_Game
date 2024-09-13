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
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, TextInput, Image, Platform, Dimensions, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { fonts, colors, commonStyle } from '../global/commonStyle';
//  import logo from './logo.svg';
import '../App.css';
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'
import axios from "axios"
import base58 from 'bs58';

import { getWalletSOLBalance, getWalletInfo, getNFTsWithImage, getNFTOne, getAdminData } from '../global/global';
import { metadata, chains, solanaConfig, projectId } from '../global/global';
import { deepCopy, jsonUpdate } from '../global/common';
import GameContext from '../context/GameContext';
import NFTDialog from './NFTScreen';
import AdminDialog from './AdminScreen';

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
    if (!walletProvider || !address || !connection) {
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
            {/* {user && user.isAdmin && */}
              <Text style={{
                fontFamily: fonts.fantasy,
                fontSize: '20px',
                padding: '10px',
                cursor: 'pointer',
                color: path == 'admin' ? colors.accent : 'white',
              }}
                onClick={() => {
                  navigation.navigate("AdminScreen")
                }}
              >
                Admin
              </Text>
            {/* } */}
            <Text style={{
              fontFamily: fonts.fantasy,
              fontSize: '20px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'home' ? colors.accent : 'white',
            }}
              onClick={() => {
                navigation.navigate("LandingScreen");
              }}
            >
              Home
            </Text>
            <Text style={{
              fontFamily: fonts.fantasy,
              fontSize: '20px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'guide' ? colors.accent : 'white',
            }}
              onClick={() => {
                navigation.navigate("GuideScreen");
              }}
            >
              How to Play
            </Text>
            <Text style={{
              fontFamily: fonts.fantasy,
              fontSize: '20px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'leaderboard' ? colors.accent : 'white',
            }}
              onClick={() => {
                navigation.navigate("LeaderboardScreen");
              }}
            >
              Leaderboard
            </Text>
            <View style={{
              padding: '10px',
              background: 'rgba(039, 88, 123, 1)',
              boxShadow: '0px 3px 10px gray',
              borderRadius: '20px',
              display: 'flex', flexDirection: 'row',
            }}>

              {address && ((user.avatar >= 0) ? <img
                src={user.nfts[user.avatar].image}
                style={{
                  width: 35, height: 35,
                  cursor: 'pointer',
                  borderRadius: '50%',
                }}
                onClick={() => {
                  navigation.navigate("NFTScreen")
                }}
              /> : <Image source={require("../assets/crossy_logo.png")}
                style={{
                  width: 35, height: 35,
                  cursor: 'pointer',
                  borderRadius: '50%',
                }}
                onClick={() => {
                  navigation.navigate("NFTScreen")
                }}
              />)}
              <Text style={{
                fontFamily: fonts.fantasy,
                fontSize: '20px',
                cursor: 'pointer',
                color: 'white',
                margin: 'auto',
                marginLeft: '10px',
              }} onClick={() => {
                onConnectBtnClick();
              }}>
                {address ? address.substring(0, 4) + '...' + address.substring(address.length - 4) : 'Connect Wallet'}
              </Text>
            </View>

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
                fontFamily: fonts.fantasy,
                color: colors.accent,
              }}>Close</Text>
            </View> :
            <View style={{
              padding: '10px',
              cursor: 'pointer',
              zIndex: '5000'
            }}
              onClick={handleOpenMenu} >
              <Text style={{ color: 'white', fontFamily: fonts.fantasy }}>Menu</Text>
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
              fontFamily: fonts.fantasy,
              fontSize: '32px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'admin' ? colors.accent : 'white',
              fontWeight: '900',
            }}
              onClick={() => {
                navigation.navigate("AdminScreen");
                handleCloseMenu();
              }}
            >
              Admin
            </Text>
            <Text style={{
              fontFamily: fonts.fantasy,
              fontSize: '32px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'home' ? colors.accent : 'white',
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
              fontFamily: fonts.fantasy,
              fontSize: '32px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'guide' ? colors.accent : 'white',
            }}
              onClick={() => {
                navigation.navigate("GuideScreen");
              }}
            >
              How to Play
            </Text>
            <Text style={{
              fontFamily: fonts.fantasy,
              fontSize: '32px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'leaderboard' ? colors.accent : 'white',
            }}
              onClick={() => {
                navigation.navigate("LeaderboardScreen");
              }}
            >
              Leaderboard
            </Text>
            <Text style={{
              fontFamily: fonts.fantasy,
              fontSize: '32px',
              padding: '10px',
              background: 'rgba(039, 88, 123, 1)',
              boxShadow: '0px 3px 10px gray',
              borderRadius: '20px',
              cursor: 'pointer',
              color: 'white'
            }} onClick={() => {
              onConnectBtnClick();
            }}>
              {address ? address.substring(0, 4) + '...' + address.substring(address.length - 4) : 'Connect Wallet'}
            </Text>
            {address && ((user.avatar >= 0) ? <img
              src={user.nfts[user.avatar].image}
              style={{
                width: 35, height: 35,
                margin: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => {
                navigation.navigate("NFTScreen")
              }}
            /> : <Image source={require("../assets/crossy_logo.png")}
              style={{
                width: 35, height: 35,
                margin: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => {
                navigation.navigate("NFTScreen")
              }}
            />)}
          </View>
        </>
      }
    </View >
  );
};

export default LoadingScreen;

