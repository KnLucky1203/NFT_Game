import { View, StyleSheet, Text, TextInput, Image, Platform, Dimensions, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigation } from "@react-navigation/native";
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'


// Personal informations
import { colors, fonts, commonStyle } from '../global/commonStyle';
import GameContext from '../context/GameContext';
import HeaderScreen from "./HeaderScreen";
import { deepCopy } from "../global/common"
import { getAdminData } from '../global/global';

// Initial Variables

export default function AdminScreen() {
  /* ================================ For Mobile Responsive ===============================*/
  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
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
  // Initial Variables
  const navigation = useNavigation();
  const [path, setPath] = useState("admin");

  // Personal Variables
  const { walletProvider, connection } = useWeb3ModalProvider()


  const renderAdminAvatar = ({ item, index }) => (
    <View style={{
      marginBottom: '10px',
      width: '100%',
      padding: '2px',
      // background : 'rgba(255,255,255,0.8)',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      columnGap: '10px',
    }}>
      <img
        src={item.image}
        style={{
          position: 'relative',
          width: '50px',
          height: '50px',
          borderRadius: '9px',
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
        ...commonStyle.button,
        margin: 'auto',
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
  // useEffect(() => {
  //   setAdmin({
  //     taxWallet: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6',
  //     token: '',
  //     tokenPerUnit: 0.5,
  //     nfts: [
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 1' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 2' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 3' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 4' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 5' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 6' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 7' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 8' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 9' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 10' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 11' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 12' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 13' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 14' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 15' },
  //       { address: '7GrU15pFFsWvJvNyihX9nvuCBDYumYjbd8WFsQWkd9G6', image: 'http://127.0.0.1:19006/static/media/avatar_player2.c39196b1457387601200.png', name: 'test name 16' },
  //     ]
  //   }); // TODO: local test
  // }, [])
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
  const [newTaxWallet, setNewTaxWallet] = useState('');
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
      display: 'flex',
      flexDirection: 'column',
      fontFamily: fonts.fantasy,
    }}>
      <HeaderScreen path={path}></HeaderScreen>

      <View style={{
        position: 'relative',
        height: 'calc(100vh - 100px)',
        background: 'black',
        display: 'flex',
        flexDirection: isPC ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {isPC &&
          <View style={{
            width: '50%', height: '100%',
            display: 'flex',
            borderRight: '1px solid white'
          }}>
            <Image source={require("../assets/avatar/avatar_player3.png")}
              style={{
                width: '100%', height: '100%',
                margin: 'auto'
              }}
            />
          </View>
        }

        <View style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          columnGap: '10px',
          width: isPC ? '50%' : '100%',
          height: '100%',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'space-between'
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
            display: 'flex', flexDirection: isPC ? 'row' : 'column', marginRight: '20px', marginLeft: '10px',
            width: '100%', padding: isPC ? '10px' : '10px', alignItems: 'center', justifyContent: 'center', columnGap: '20px',
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
              maxWidth: '510px',
              padding: '0.5rem',
              flex: 1,
              border: '1px solid gray',
              borderRadius: '30px',
              background: 'transparent',
              fontSize: '16px',
              textAlign: 'left',
              lineHeight: '2',
              color: 'white',
            }}
              type="text" placeholder="Tax Wallet"
              value={admin.taxWallet}
              onChange={(e) => {
                setNewTaxWallet()
              }}
              autoFocus />
            <View style={{
              ...commonStyle.button,
              width: '65px',
            }}
              onClick={() => {
                setTaxWallet(e.target.value);
              }}>Set
            </View>
          </View>
          <View style={{
            display: 'flex', flexDirection: isPC ? 'row' : 'column', marginRight: '20px', marginLeft: '10px',
            width: '100%', padding: isPC ? '10px' : '10px', alignItems: 'center', justifyContent: 'center', columnGap: '20px',
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
              ...commonStyle.button,
              width: '65px',
            }}
              onClick={() => {
                addNewNFT()
              }}>Add
            </View>
          </View>
          <View style={{
            width: '100%',
            maxWidth: '800px',
          }}>
            <Text style={{
              color: 'white',
              fontSize: '20px',
              display: 'block',
              marginRight: 'auto',
              marginLeft: '30px',
            }}
            >
              NFT List
            </Text>
          </View>
          <View style={{
            marginTop: '10px', display: 'flex', flexDirection: 'column', flex: 1, height: '100%',
            border: '1px solid gray', borderRadius: '16px', width: '100%', padding: '10px',
            overflowY: 'scroll', scrollbarWidth: 'thin', maxWidth: '800px', marginBottom: '20px',
          }}>
            {(admin && admin.nfts) ? admin.nfts.map((item, index) => {
              return renderAdminAvatar({ item, index })
            }) : ''}
          </View>
        </View>
      </View>
    </View >
  );
}
