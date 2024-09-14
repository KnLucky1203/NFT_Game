import { View, StyleSheet, Text, TextInput, Image, Platform, Dimensions, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';

import { fonts } from '../global/commonStyle';
import GameContext from '../context/GameContext';
import HeaderScreen from "./HeaderScreen";
import { deepCopy } from '../global/common';

export default function NFTScreen({ openNFT, setOpenNFT }) {
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
  const [path, setPath] = useState("nft");

  const { user, setUser,
    setLoadingState,

  } = React.useContext(GameContext);

  const renderAvatar = ({ item, index }) => (
    <View style={{
      padding: '10px',
      width: isPC ? '30%' : '80%',
      display: 'flex', flexDirection: 'column',
      cursor: 'pointer',
      background: 'rgba(0,0,255,0.1)',
      border: index == user.avatar ? '1px solid gray' : 'none',
      borderRadius: '10px'
    }} onClick={() => {
      const new_user = deepCopy(user);
      new_user.avatar = index;
      setUser(new_user);
      console.log('set avatar', new_user);
    }}>
      <img
        src={item.image}
        style={{
          position: 'relative',
          width: '80%',
          margin: 'auto',
          borderRadius: '10%',
          boxShadow: index == user.avatar ? '10px 10px 10px rgba(255,0,0,0.5)' : 'none',
        }}
      />
      <Text style={{ color: 'white', fontSize: isPC ? '18px' : '32px' }}>{item.name}</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Image source={require("../assets/character/character1.webp")}
          style={{
            width: '100%', height: '100%',
            margin: 'auto'
          }}
        />
      </View>
    </View >
  );

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
            borderRight: commonStyle.border
          }}>
            <Image source={require("../assets/avatar/nft_mobber_1.jpg")}
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
          <View style={{
            width: '100%',
            height: isPC ? '200px' : '100px',
            borderBottom: commonStyle.border,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: isPC ? '60px' : '36px',
              color: 'rgba(253, 198, 211, 1)',
              WebkitTextStroke: '2px rgba(239, 88, 123, 1)',
              filter: 'drop-shadow(3px 5px 8px #ff0000)',
              fontWeight: '900',
              textShadow: '0 0 5px #fff',
            }}>My NFTs</Text>
          </View>

          <View style={{
            padding: '25px',
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            margin: 'auto',
            flex: 1, justifyContent: 'center'
          }}>
            {(user && user.nfts) ? user.nfts.map((item, index) => {
              return renderAvatar({ item, index })
            }) : 'NFTs not found'}
          </View>
        </View>
      </View>
    </View >
  );
}
