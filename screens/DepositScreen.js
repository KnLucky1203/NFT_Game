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
import { globalMap } from "../global/globalMap";
import { socket } from '../global/global';
// Personal informations
import GameContext from '../context/GameContext';
import HeaderScreen from "./HeaderScreen";
import { colors, fonts, commonStyle } from "../global/commonStyle";
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'

import { Connection, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { getDepositAddress } from "../global/global";
import {
  getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, Token,
  getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction,
  getMint
} from '@solana/spl-token';
// Guide Page component
const DepositScreen = () => {
  const { user, setUser,  } = React.useContext(GameContext);

  /* ================================ For Mobile Responsive ===============================*/
  const [path, setPath] = useState("room");
  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  const [amount, setAmount] = useState(1);
  const [serverId, setServerId] = useState('');
  const { walletProvider, connection } = useWeb3ModalProvider();
  const { address, chainId } = useWeb3ModalAccount()

  useEffect(() => {

    Linking.getInitialURL().then(url => {
      if (url) {
        const _serverId = url.split('/?')[1];
        console.log("server id : ", _serverId);
        if (_serverId) {
          setServerId(_serverId);
        }
        // setRoomPath(FRONTEND_URL + "/?" + _serverId);
      }
    }).catch(err => console.error('An error occurred', err));


    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };

    const handleSocketRoom = (data) => {
      console.log("------RETURN_AMOUNT")
      if (data.cmd === "RETURN_AMOUNT") {
        setAmount(data.serverAmount);
      }
    };

    if (serverId) {

    socket.emit('message', JSON.stringify({
      cmd: 'GET_AMOUNT',
      name: serverId.toString(),
    }));
  }
    socket.on('ROOM', handleSocketRoom);
    window.addEventListener('resize', handleResize);
    return () => {
      socket.off('ROOM', handleSocketRoom);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* ================================ For Mobile Responsive ===============================*/

  // Initial Variables
  const navigation = useNavigation();
  const {
    socket, gameMode, setGameMode, myRoomInfo, role, setMyRoomInfo, adminWallet, userInfo,
  } = React.useContext(GameContext);

  const setBetAmount = (value) => {

    console.log("serverId============", serverId);
    if (serverId) {
      window.alert("Server already select the amount of deposit token");
      return;
    }
    setAmount(value);
  }

  const depositToken = async () => {

    let response;
    try {
      response = await getDepositAddress();
    } catch (error) {
      console.error('Error fetching deposit address:', error);
      return;
    }

    const tokenAddr = response.data.data.tokenAddress;

    if (!walletProvider || !address || !connection) {
      window.alert('walletProvider or address is undefined');
      return;
    }
    try {
      const myAddr = address; // The address of the user
      const adminWalletAddr = response.data.data.depositAddress; // Admin address
      /*
            const sender = new PublicKey(myAddr); // User's public key
            const receiver = new PublicKey(adminWalletAddr); // Admin's public key
            const mint = new PublicKey(tokenAddr); // Token mint address
      
            const fromATA = getAssociatedTokenAddressSync(mint, sender);
            const toATA = getAssociatedTokenAddressSync(mint, receiver);
      
            let instructions = [];
            const info = await connection.getAccountInfo(toATA);
            if (!info) {
              instructions.push(createAssociatedTokenAccountInstruction(sender, toATA, receiver, mint));
            }
            const tokenMint = await getMint(connection, mint);
            instructions.push(createTransferInstruction(fromATA, toATA, sender, amount * 10 ** tokenMint.decimals));
      
            const tx = new Transaction().add(...instructions);
            const { blockhash } = await connection.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.feePayer = sender;
            console.log("deposit1--------------->");
            const signature = await walletProvider.sendTransaction(tx, connection);
      
            console.log("deposit2--------------->", signature);
            await connection.confirmTransaction(signature, 'processed');
      
            console.log("deposit3--------------->", signature);
            setDeposited(true);
            socket.emit('message', JSON.stringify({
              cmd: 'TOKEN_DEPOSITED', role: role
            }));
            
      */
      console.log("^^^^^^^^^^^^^^", globalMap);
      if (serverId) {     // JOIN TO THE OTHER SERVER SPECIFIED IN THE SERVER ID
        socket.emit('message', JSON.stringify({
          cmd: 'ACTION_JOIN_GAME',
          name: serverId.toString(),
          player2: userInfo.username,
        }));
      } else {
        socket.emit('message', JSON.stringify({
          cmd: 'ACTION_CREATE_ROOM',
          player1: userInfo.username,
          map: globalMap,
          amount: amount
        }));
      }

    } catch (error) {
      console.error('Error depositng:', error);
      return;
    }


    return;
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
          }}>Deposit Tokens</Text>

          <View style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center',
            columnGap: '10px'
          }}>
            <Text style={{
              ...amount == 1 ? commonStyle.toggleBtn1 : commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {
                setBetAmount(1)
              }
              }
            >1</Text>
            <Text style={{
              ...amount == 5 ? commonStyle.toggleBtn1 : commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {
                setBetAmount(5)
              }
              }
            >5</Text>
            <Text style={{
              ...amount == 10 ? commonStyle.toggleBtn1 : commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {
                setBetAmount(10)
              }
              }
            >10</Text>
            <Text style={{
              ...amount == 50 ? commonStyle.toggleBtn1 : commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {
                setBetAmount(50)
              }
              }
            >50</Text>
            <Text style={{
              ...amount == 100 ? commonStyle.toggleBtn1 : commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {
                setBetAmount(100)
              }
              }
            >100</Text>
          </View>

          <Text style={{
            ...commonStyle.button,
            marginTop: '20px',
            fontFamily: 'Horizon',
          }}
            onClick={depositToken}
          >
            Deposit
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

export default DepositScreen;


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
