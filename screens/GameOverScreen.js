import React, { Component, useContext, useState, useEffect } from "react";
import { Image, Dimensions, Text, Alert, Animated, Easing, StyleSheet, View } from "react-native";

import GameContext from "../context/GameContext";
import { fonts } from '../global/commonStyle';
import { useNavigation } from "@react-navigation/native";
import { commonStyle } from "../global/commonStyle";
import { colors } from "../global/commonStyle";

function GameOver({ ...props }) {
  const { gameMode, setGameMode, character } = React.useContext(GameContext);
  const navigation = useNavigation();

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
        GAME OVER!
      </Text>
      <Text style={{
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '900',
        color: 'white',
         fontFamily: 'Horizon'
      }}>
        You scored&nbsp;
        <Text style={{ color: colors.accent, fontFamily: 'Horizon', }}>350</Text> Crash Tokens
      </Text>
      <Text style={{
        ...commonStyle.button,
        fontFamily: fonts.fantasy,
        marginTop: '25px',
        marginBottom: '10px',
        fontFamily: 'Horizon',
      }}
        onClick={restartGame}
      >
        Play Again
      </Text>
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
