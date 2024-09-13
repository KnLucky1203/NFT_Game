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

  const { user, setUser } = React.useContext(GameContext);

  // useEffect(() => {
  //   setUser({
  //     avatar: 0,
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

  const renderAvatar = ({ item, index }) => (
    <View style={{
      padding: '10px',
      width: isPC ? '33%' : '100%',
      // background : 'rgba(255,255,255,0.8)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      cursor: 'pointer',
    }} onClick={() => {
      const new_user = deepCopy(user);
      new_user.avatar = index;
      setUser(new_user);
      console.log('set avatar', new_user);
    }}>
      <View style={{
        border: '1px solid white',
        borderRadius: '20px',
      }}>
        <div style={{
          textAlign: 'center', color: 'white',width: '100%',
        }}>
          <Text style={{ margin: 'auto', marginTop: '20px', textAlign: 'center', color: 'white', width: '100%', fontSize: '27px' }}>{item.name}</Text>
          <View style={{ padding: '20px', paddingTop: '5px', paddingBottom: '15px' }}>
            <img
              src={item.image}
              style={{
                position: 'relative',
                width: '100%',
                border: index == user.avatar ? '2px solid yellow' : 'none',
                borderRadius: '12px',
                margin: 'auto',
              }}
            />
          </View>
        </div>
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
          }}>My NFTs</Text>
          <View style={{
            paddingLeft: '20px',
            paddingRight: '20px',
            border: '1px solid gray',
            borderRadius: '16px',
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            overflowY: 'scroll',
            scrollbarWidth: 'thin',
            margin: 'auto',
            flex: 1,
            maxWidth: '800px',
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
