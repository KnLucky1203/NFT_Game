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
import { fonts } from '../global/commonStyle';
//  import logo from './logo.svg';
import '../App.css';
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'
import axios from "axios"
import base58 from 'bs58';
import { getWalletSOLBalance, getWalletInfo, getNFTsWithImage, getNFTOne, getAdminData } from '../global/global';
import { metadata, chains, solanaConfig, projectId } from '../global/global';
import { deepCopy, jsonUpdate } from '../global/common';
import GameContext from '../context/GameContext';
import { colors } from "../global/commonStyle";

const modelList = [
  { label: 'Model 1', value: '1' },
  { label: 'Model 2', value: '2' },
  { label: 'Model 3', value: '3' },
  { label: 'Model 4', value: '4' },
  { label: 'Model 5', value: '5' },
  { label: 'Model 6', value: '6' },
  { label: 'Model 7', value: '7' },
  // ... more items
];
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

  const [dash, setDash] = useState(false)

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

  const renderAvatar = ({ item, index }) => (
    <View style={{
      marginBottom: '20px',
      padding: '2%',
      // display: 'block',
      width: isPC ? '160px' : '100px',
      // background : 'rgba(255,255,255,0.8)',
      position: 'relative',
      cursor: 'pointer',
    }} onClick={() => {
      const new_user = deepCopy(user);
      new_user.avatar = index;
      setUser(new_user);
      setOpenNFTDialog(false);
      console.log('set avatar', new_user);
    }}>
      <div style={{
        textAlign: 'center', color: 'white',
        width: '100%',
      }}>
        <img
          src={item.image}
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: '50%',
            borderWidth: '2px',
            borderColor: 'white',
            marginBottom: '5px',
          }}
        />
        <Text style={{ margin: 'auto', textAlign: 'center', color: 'white', width: '100%', fontSize: '16px' }}>{item.name}</Text>
      </div>
    </View >
  );

  const renderAdminAvatar = ({ item, index }) => (
    <View style={{
      marginBottom: '10px',
      width: '100%',
      padding: '2px',
      // background : 'rgba(255,255,255,0.8)',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
    }}>
      <img
        src={item.image}
        style={{
          position: 'relative',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '1px solid white',
          marginLeft: '10px',
        }}
      />
      {isPC && <Text style={{ margin: 'auto', flex: '1', textAlign: 'center', color: 'white', width: '100%', fontSize: '16px' }}>{item.address}</Text>}
      <Dropdown
        style={{  // main selected item
          width: '140px',
          cursor: 'pointer',
          // backgroundColor: 'black',
          textAlign: 'center',
          border: '1px solid white',
          borderRadius: '50px',
          height: '45px',
          margin: 'auto',
        }}
        containerStyle={{ // main selected item
          backgroundColor: 'black',
          textAlign: 'center',
        }}
        placeholderStyle={{ // placeholder text style
          color: 'grey',
          // backgroundColor: 'black',
          textAlign: 'center',
          // border: '1px solid white'
        }}
        selectedTextStyle={{  // main selected item text style
          color: 'white',
          // backgroundColor: 'black',
          textAlign: 'center',
          borderWidth: '1px solid white',
        }}
        itemContainerStyle={{ // list item container style
          backgroundColor: 'black',
          textAlign: 'center',
        }}
        itemTextStyle={{  // list item text style
          // backgroundColor: 'black',
          color: 'white',
          textAlign: 'center',
        }}
        activeColor='#222222'
        mode={isPC ? 'auto' : 'modal'}
        ref={isPC ? top : undefined}
        inputSearchStyle={{  // list item text style
          backgroundColor: '#FF0000',
          color: 'white',
          textAlign: 'center',
        }}
        iconStyle={{  // main drop icon style
          // backgroundColor: '#0000FF',
          color: 'white',
          textAlign: 'center',
          width: '30px',
          height: '30px',
        }}
        data={modelList}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select model"
        value={item.model}
        onChange={model => {
          const new_admin = deepCopy(admin);
          new_admin.nfts[index].model = model.value;
          setAdmin(new_admin);
        }}
      />
      <View style={{
        margin: 'auto',
        padding: '10px',
        textAlign: 'center',
        cursor: 'pointer',
        hoverable: true,
        hoverColor: '#AAAAAA',
        width: '80px',
        height: '45px',
        borderRadius: '30px',
        borderColor: 'white',
        borderWidth: '1px',
        backgroundColor: 'transparent',
        color: 'white',
        marginLeft: '10px',
        justifyContent: 'center',
      }}
        onClick={() => {
          const new_admin = deepCopy(admin);
          new_admin.nfts.splice(index, 1);
          setAdmin(new_admin);
        }}>Delete</View>
    </View >
  );
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
      {dash && <View style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        zIndex: 999,
      }}>
        <View style={{
          maxWidth: '1000px',
          width: '80vw',
          height: '90vh',
          backgroundColor: 'rgba(10,10,10,1)',
          border: '1px solid blue',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'absolute',
          margin: 'auto',
          marginTop: '5vh',
        }}>
          <Text style={{
            fontSize: isPC ? '72px' : '40px',
            color: 'rgba(253, 198, 211, 1)',
            WebkitTextStroke: '2px rgba(239, 88, 123, 1)',
            filter: 'drop-shadow(3px 5px 8px #ff0000)',
            fontWeight: '900',
            textShadow: '0 0 5px #fff',
            margin: '20px',
          }}>Admin Dashboard</Text>
          <View style={{
            display: 'flex', flexDirection: isPC ? 'row' : 'column', marginRight: '10px', marginLeft: '10px',
            width: '100%', padding: isPC ? '20px' : '10px', alignItems: 'center', justifyContent: 'center'
          }}>
            <Text style={{
              color: 'white',
              fontSize: '20px',
              display: 'block',
            }}
            >
              Owner Wallet
            </Text>
            <TextInput style={{
              width: '100%',
              maxWidth: '600px',
              padding: '0.5rem',
              flex: 1,
              border: '1px solid gray',
              borderRadius: '30px',
              background: 'transparent',
              marginLeft: '20px',
              fontSize: '16px',
              textAlign: 'left',
              lineHeight: '2',
              color: 'white',
            }}
              type="text" placeholder="Tax Wallet"
              value={admin.taxWallet}
              onChange={(e) => {
                setTaxWallet(e.target.value);
              }}
              autoFocus />
          </View>
          <View style={{
            display: 'flex', flexDirection: isPC ? 'row' : 'column', marginRight: '10px', marginLeft: '10px',
            width: '100%', padding: isPC ? '20px' : '10px', alignItems: 'center', justifyContent: 'center'
          }}>
            <Text style={{
              color: 'white',
              fontSize: '20px',
              display: 'block',
            }}
            >
              Add New NFT
            </Text>
            <TextInput style={{
              width: '100%',
              maxWidth: '510px',
              padding: '0.5rem',
              flex: 1,
              border: '1px solid gray',
              borderRadius: '30px',
              background: 'transparent',
              marginLeft: '20px',
              fontSize: '16px',
              textAlign: 'left',
              lineHeight: '2',
              color: 'white',
            }}
              type="text" placeholder="Input new nft mint address."
              onChange={(e) => {
                setNewNFT(e.target.value);
              }}
            />
            <View style={{
              padding: '10px',
              marginLeft: '10px',
              textAlign: 'center',
              cursor: 'pointer',
              hoverable: true,
              hoverColor: '#AAAAAA',
              width: '80px',
              height: '45px',
              borderRadius: '30px',
              borderColor: 'white',
              borderWidth: '1px',
              backgroundColor: 'transparent',
              color: 'white',
              marginLeft: '10px',
              justifyContent: 'center',
            }}
              onClick={() => {
                addNewNFT()
              }}>Add
            </View>
          </View>
          <View style={{
            marginTop: '10px', display: 'flex', flexDirection: 'column', flex: 1, height: '100%',
            borderColor: 'white', borderRadius: '16px', borderWidth: '1px', width: '100%', padding: '5px',
            overflowY: 'scroll', scrollbarWidth: 'thin', maxWidth: '800px',
          }}>
            {(admin && admin.nfts) ? admin.nfts.map((item, index) => {
              return renderAdminAvatar({ item, index })
            }) : ''}
          </View>
          <button style={{
            position: 'absolute',
            bottom: '20px',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '24px',
            borderRadius: '20px',
            letterSpacing: '3px',
            cursor: 'pointer',
            margin: 'auto',
          }} onClick={() => {
            setDash(false);
          }}> Close </button>
        </View>
      </View>}
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
              fontFamily: fonts.fantasy,
              fontSize: '20px',
              padding: '10px',
              cursor: 'pointer',
              color: path == 'admin' ? colors.accent : 'white',
            }}
              onClick={() => {
                setDash(true);
              }}
            >
              Admin
            </Text>
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
            <Text style={{
              fontFamily: fonts.fantasy,
              fontSize: '20px',
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
                width: 45, height: 45,
                cursor: 'pointer',
                borderRadius: '50%',
              }}
              onClick={() => {
                setOpenNFTDialog(!openNFTDialog);
              }}
            /> : <Image source={require("../assets/crossy_logo.png")}
              style={{
                width: 45, height: 45,
                cursor: 'pointer',
                borderRadius: '50%',
              }}
              onClick={() => {
                setOpenNFTDialog(!openNFTDialog);
              }}
            />)}
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
                width: 45, height: 45,
                margin: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => {
                setOpenNFTDialog(!openNFTDialog);
              }}
            /> : <Image source={require("../assets/crossy_logo.png")}
              style={{
                width: 45, height: 45,
                margin: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => {
                setOpenNFTDialog(!openNFTDialog);
              }}
            />)}
          </View>
        </>
      }
      {openNFTDialog ? (
        <View style={{
          position: 'absolute', background: 'rgba(0, 0, 0, 0.95)',
          borderWidth: '1px', borderColor: 'white', borderRadius: '30px',
        }}>
          <Text style={{ height: '50px', fontSize: '30px', fontWeight: 'bold', color: 'white', marginLeft: '20px', marginTop: '10px' }}>Select NFT</Text>
          <View style={{
            width: '95%',
            height: '80%',
            marginBottom: '40px',
            padding: '10px',
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            overflowY: 'scroll',
            scrollbarWidth: 'thin',
            margin: 'auto'
          }}>
            {(user && user.nfts) ? user.nfts.map((item, index) => {
              return renderAvatar({ item, index })
            }) : ''}
          </View>
          <View style={{ position: 'absolute', bottom: '10px', width: '100%', maxHeight: '160px', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <button style={{
              width: '140px',
              height: '40px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '24px',
              borderRadius: '20px',
              letterSpacing: '3px',
              cursor: 'pointer',
              marginLeft: 'auto',
              marginRight: '20px',
            }} onClick={handleGetWalletInfo} > Refresh </button>
            <button style={{
              width: '140px',
              height: '40px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '24px',
              borderRadius: '20px',
              letterSpacing: '3px',
              cursor: 'pointer',
              marginLeft: '20px',
              marginRight: 'auto',
            }} onClick={() => setOpenNFTDialog(false)} > Cancel </button>
          </View>
        </View>
      ) : ''}
    </View >
  );
};

export default LoadingScreen;

