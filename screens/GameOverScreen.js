import React, { Component, useContext, useState, useEffect } from "react";
import { Image, Dimensions, Text, Alert, Animated, Easing, StyleSheet, View } from "react-native";

import GameContext from "../context/GameContext";
import { fonts } from '../global/commonStyle';
import { useNavigation } from "@react-navigation/native";
import { commonStyle } from "../global/commonStyle";
import { colors } from "../global/commonStyle";
import { socket} from '../global/global';

function GameOver({ ...props }) {
  const { gameMode, setGameMode, character, role } = React.useContext(GameContext);
  const navigation = useNavigation();

  /* ================================ For Mobile Responsive ===============================*/

  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  const [pvpEndFlag, setPvpEndflag] = useState(false);
  const [resultString, setResultString] = useState("");
  const [otherScore, setOtherScore] = useState(0);
  const {
    // set the socket to the context
    setSocket,
  } = React.useContext(GameContext);
  useEffect(() => {
    setSocket(socket);
    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };

    const handleSocketRoom = (data) => {
      // console.log("handleSocketRoom = ", data);
      console.log("--data:", data);
      if (data.cmd === "MATCH_RESULT") {
        if (role == "server") {
          setOtherScore(data.score2);
          if (data.score1> data.score2) {
            setResultString("You Won");
          }
          else if (data.score1 < data.score2) {
            setResultString("You Lost");            
          }
          else {
            setResultString("Drawed");
          }
        }
        if (role == "client") {
          setOtherScore(data.score1);
          if (data.score1 < data.score2) {
            setResultString("You Won");
          }
          else if (data.score1 > data.score2) {
            setResultString("You Lost");
          }
          else {
            setResultString("Drawed");
          }
        }
        setPvpEndflag(true);
      }
    }

    window.addEventListener('resize', handleResize);
    socket.on('ROOM', handleSocketRoom);
    return () => {
      window.removeEventListener('resize', handleResize);
      socket.off('ROOM', handleSocketRoom);
    };

    

  }, []);

  /* ================================ For Mobile Responsive ===============================*/

  const restartGame = () => {
    props.setGameState('none');
    // setGameMode(0);
    // navigation.navigate("GameScreen");

    // props.navigation.goBack();
    // props.onRestart();
    // props.setGameState(true);
  };

  return (
    <Animated.View style={{
      background: 'black',
      width: isPC ? '600px' : '350px',
      height: isPC ? '394px' : '372px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      rowGap: '20px',
      paddingTop: '10px',
      // paddingBottom: '10px',
      border: '2px solid gray',
      borderRadius: '20px',
    }}>
      <Text style={{
              fontSize: isPC ? '96px' : '64px',
              color: '#FDC6D3',
              WebkitTextStroke: '1px #EF587B',
              filter: 'drop-shadow(0px 0px 20px #EF587B)',
              fontWeight: '700',
              // textShadow: '0 0 5px #fff',
              fontFamily: 'Horizon'
      }}>
        {!pvpEndFlag||gameMode==0?"GAME OVER":resultString}
      </Text>
      <Text style={{
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '900',
        color: 'white',
         fontFamily: 'Horizon'
      }}>
        You score is&nbsp;&nbsp;
        <Text style={{ color: colors.accent, fontFamily: 'Horizon', fontSize: "32px"}}>{props.score}</Text>
      </Text>
      {pvpEndFlag&&<Text style={{
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '900',
        color: 'white',
         fontFamily: 'Horizon'
      }}>
        Other score is&nbsp;&nbsp;
        <Text style={{ color: colors.accent, fontFamily: 'Horizon', fontSize: "32px"}}>{otherScore}</Text>
      </Text>}
      {pvpEndFlag||gameMode==0?<Text style={{
        ...commonStyle.button,
        fontFamily: fonts.fantasy,
        marginTop: '25px',
        marginBottom: '10px',
        fontFamily: 'Horizon',
      }}
        onClick={restartGame}  
      >
        Play Again
      </Text>:<Text style={{
        textAlign: 'center',
        fontSize: '30px',
        fontWeight: '900',
        color: 'red',
         fontFamily: 'Horizon'
      }}>
        Wait Other!!!
      </Text>}
    </Animated.View>

  );
}

export default GameOver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});
