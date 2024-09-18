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
import io from 'socket.io-client';
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, Image, Platform, Dimensions, Linking } from 'react-native';

// Personal informations
import GameContext from '../context/GameContext';
import HeaderScreen from "./HeaderScreen";
import { colors, fonts, commonStyle } from "../global/commonStyle";
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';

// Guide Page component
const GameRoomScreen = () => {
  const { user, setUser} = React.useContext(GameContext);

  /* ================================ For Mobile Responsive ===============================*/

  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  const [amount, setAmount] = useState(1);

  useEffect(() => {

    console.log("GameRoomScreen : ", myRoomInfo);

    if (myRoomInfo.room_state != 'opened') {
      window.alert("Room Not Created !");
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };

    const handleSocketAmount = (data) => {
      console.log("---amount1---", data.amount);
      setAmount(data.amount);
    }
    const handleSocketRoom = (data) => {
      // console.log("handleSocketRoom in gameroomscreen",data);
      console.log("---amount2---", data.amount);
      if (data.cmd == "CLIENT_PLAY_AGAIN_APPROVED") {
        setMyRoomInfo(prevRoomInfo => ({
          ...prevRoomInfo,
          client_ready: true
        }));
      }
      // setAmount(data.amount);
    }

    if (role == "server")
      setBetAmount(myRoomInfo.amount);
    else {
      console.log("---amount3---", myRoomInfo.amount);
      setAmount(myRoomInfo.amount);
    }

    socket.on('BET_AMOUNT_SET', handleSocketAmount);
    socket.on('ROOM', handleSocketRoom);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      socket.off('BET_AMOUNT_SET', handleSocketAmount);
    };
  }, []);

  /* ================================ For Mobile Responsive ===============================*/

  // Initial Variables
  const navigation = useNavigation();
  const {
    socket, gameMode, setGameMode, myRoomInfo, role, setMyRoomInfo,
  } = React.useContext(GameContext);

  const [path, setPath] = useState("room");
  const [copied, setCopied] = useState(false);

  const reduceString = (str, len = isPC ? 40 : 38) => {
    if (str.toString().length <= len)
      return str;
    return str.slice(0, 20) + "..." + str.slice(-15);
  }

  const readFromClipboard = () => {
    // Create a temporary input element
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.style.position = 'absolute'; // Position it off-screen
    input.style.opacity = '0'; // Make it invisible
    input.focus();

    // Allow the user to paste into the input field
    input.select();
    document.execCommand('paste'); // This may not work in all browsers

    // Get the pasted text
    const text = input.value;
    console.log(text);

    // Clean up the input element
    document.body.removeChild(input);
  };

  const copyToClipboard = (value) => {
    const textArea = document.createElement('textarea');
    textArea.value = value;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }

    document.body.removeChild(textArea);
  };

  const setBetAmount = (value) => {
    if (role == "server") {
      console.log("---amount4---",value);
    setAmount(value);
    socket.emit('message', JSON.stringify({
      cmd: 'SET_BET_AMOUNT',
      amount: value,
    }));
  }
  else {
    window.alert("Only Server can set amount");
  }
  }


  // Receiving events from the server

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      fontFamily: fonts.fantasy
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
            <Image source={require("../assets/avatar/avatar_player4.png")}
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
          width: isPC ? '50%' : '100%',
          height: '100%',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-end' : 'center',
          rowGap: isPC ? '20px' : '10px',
        }}>

          <Text style={{ color: 'white', fontSize: '24px', fontFamily: 'Horizon', }}>Multiplayer Robby</Text>
          <Text style={{
            fontSize: isPC ? '96px' : '64px',
            color: '#FDC6D3',
            WebkitTextStroke: '1px #EF587B',
            filter: 'drop-shadow(0px 0px 20px #EF587B)',
            fontWeight: '700',
            // textShadow: '0 0 5px #fff',
            fontFamily: 'Horizon'
          }}>HANG TIGHT...</Text>
          <View style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center',
            columnGap: '10px'
          }}>
            <View style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: '10px' }}>
              {(user.nfts && user.nfts.length && user.avatar >= 0) ? <img
                src={user.nfts[user.avatar].image}
                style={{ width: isPC ? '100px' : '60px', height: isPC ? '100px' : '60px', border: myRoomInfo.room_my_role == 0 ? '2px solid rgba(239, 88, 123, 1)' : '2px solid gray', borderRadius: '50%' }}
              /> :
                <Image source={
                  myRoomInfo.players[0].player_state ? require("../assets/avatar/avatar_player4.png") : require("../assets/avatar/avatar_empty.png")}
                  style={{ width: isPC ? '100px' : '60px', height: isPC ? '100px' : '60px', border: myRoomInfo.room_my_role == 0 ? '2px solid rgba(239, 88, 123, 1)' : '2px solid gray', borderRadius: '50%' }}></Image>}
              <Text style={{ fontSize: '24px', fontFamily: 'Horizon', color: 'white' }}>
                {myRoomInfo.players[0].player_state ? myRoomInfo.players[0].player_name : 'Server'}
              </Text>
            </View>
            <Text style={{ fontSize: '18px', color: 'gray', fontFamily: 'Horizon', }}>  VS </Text>
            <View style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: '10px' }}>
              <Image source={
                myRoomInfo.players[1].player_state ? require("../assets/avatar/avatar_player1.png") : require("../assets/avatar/avatar_empty.png")
              }
                style={{ width: isPC ? '100px' : '60px', height: isPC ? '100px' : '60px', border: myRoomInfo.room_my_role == 0 ? '2px solid gray' : '2px solid rgba(239, 88, 123, 1)', borderRadius: '50%' }}></Image>
              <Text style={{ fontSize: '24px', fontFamily: 'Horizon', color: 'white' }}>
                {myRoomInfo.players[1].player_state ? myRoomInfo.players[1].player_name : 'Client'}
              </Text>
            </View>
          </View>

          {myRoomInfo && myRoomInfo.room_my_role == 0 &&
            < View style={{ display: 'flex', flexDirection: 'row', columnGap: '10px', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Horizon', fontSize: isPC ? '18px' : '12px', color: copied ? 'rgba(239, 88, 123, 0.8)' : colors.accent, fontWeight: '800', textDecoration: 'underline', textUnderlineOffset: '10px', cursor: 'pointer' }}
                onClick={() => {
                  copyToClipboard(myRoomInfo.room_path);
                }}>
                {reduceString(myRoomInfo.room_path)}
              </Text>
              <Image source={require("../assets/icons/copyIcon.png")}
                style={{ width: isPC ? '20px' : '14px', height: isPC ? '20px' : '14px', cursor: 'pointer' }}
                onClick={() => {
                  copyToClipboard(myRoomInfo.room_path);
                }} />

            </View>}
          <View style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center',
            columnGap: '10px'
          }}>
            <Text style={{
              ...amount==1?commonStyle.toggleBtn1:commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {setBetAmount(1)
                }
              }
            >1</Text>
            <Text style={{
              ...amount==5?commonStyle.toggleBtn1:commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {setBetAmount(5)
                }
              }
            >5</Text>
            <Text style={{
              ...amount==10?commonStyle.toggleBtn1:commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {setBetAmount(10)
                }
              }
            >10</Text>
            <Text style={{
              ...amount==50?commonStyle.toggleBtn1:commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {setBetAmount(50)
                }
              }
            >50</Text>
            <Text style={{
              ...amount==100?commonStyle.toggleBtn1:commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {setBetAmount(100)
                }
              }
            >100</Text>
          </View>
          <Text style={{
            ...commonStyle.button,
            marginTop: '20px',
            fontFamily: 'Horizon',
          }}
            onClick={() => {
              console.log("$$$$$$$$$$$$$$$$$$$ amount = ", amount);
              if (myRoomInfo.room_my_role == 0) {
                if (myRoomInfo.players[1].player_name != undefined &&
                  myRoomInfo.players[1].player_state == 1
                ) {
                  if (myRoomInfo.client_ready) {
                  socket.emit('message', JSON.stringify({
                    cmd: 'ACTION_START_GAME', role: role
                  }));
                }
                else {
                  window.alert('Client is not ready');
                }
                  // window.alert("ACTION START GAME!!!");
                } else {
                  window.alert('Client not joined');
                }
              } else if (myRoomInfo.room_my_role == 1) {
                window.alert('client has no permission to start game');
              } else {
                window.alert("Someone joined in an untracked way!");
              }
            }}
          >
            Play Mobber!
          </Text>

          {isMobile &&
            <Image source={require("../assets/avatar/avatar_player4.png")}
              style={{
                width: '100%', height: '50%',
                marginLeft: 'auto'
              }}
            />}
        </View>
      </View>

    </View >
  );
};

export default GameRoomScreen;


{/*
// on click of play button
<button className="decoration-button" onClick={() => {
    if (userName !== "") {
        setGameMode(0);
        navigation.navigate("GameScreen");
    }
}} >Play !</button>

// Join Server button
{serverId &&
    <button className="decoration-button" onClick={() => {
        if (userName == "") {
            window.alert("Enter UserName !");
            return;
        }

        socket.emit('message', JSON.stringify({
            cmd: 'JOIN_GAME',
            name: serverId,
            player2: userName
        }));

    }} >Join Server
    </button>}

// Create Private Room Button
<button className="decoration-button" onClick={() => {
    // Creating the room
    if (userName == "") {
        window.alert("Enter UserName !");
        return;
    }
    setOtherName("waiting...");

    socket.emit('message', JSON.stringify({
        cmd: 'CREATE_ROOM',
        player1: userName,
        map: globalMap
    }));
}}>Create Private Room</button>

 */}
