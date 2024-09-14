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
import HeaderScreen from "./HeaderScreen";

import { fonts } from '../global/commonStyle';

// Guide Page component
const GuideScreen = () => {

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

    const [path, setPath] = useState("guide");

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
                        borderRight: '1px solid gray'
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
                }}>
                    <View style={{
                        width: '100%',
                        height: isPC ? '300px' : '185px',
                        // borderBottom: '1px solid white',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: 'white', fontSize: '20px', fontFamily: 'Horizon', }}>Get Started</Text>
                        <Text style={{
                            fontSize: isPC ? '96px' : '64px',
                            color: '#FDC6D3',
                            WebkitTextStroke: '1px #EF587B',
                            filter: 'drop-shadow(0px 0px 20px #EF587B)',
                            fontWeight: '700',
                            // textShadow: '0 0 5px #fff',
                            fontFamily: 'Horizon'
                        }}>How to Play</Text>
                    </View>
                    <View style={{
                        width: '100%',

                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <Text style={{ marginTop: '36px', color: 'white', fontSize: '36px', fontFamily: 'Horizon', }}>
                            Title Here
                        </Text>

                        <Text style={{ marginTop: '36px', color: 'white', fontSize: '20px', fontFamily: 'Horizon', width: isPC?'70%':'90%', textAlign: 'center' }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tortor tortor, convallis id maximus non, semper eu sapien. Aliquam efficitur urna ac sapien ornare, vitae ornare nunc placerat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi massa ante, accumsan quis sollicitudin ut, sodales eget sapien. Praesent rhoncus elit et urna cursus facilisis.
                        </Text>

                        <Text style={{ marginTop: '20px', color: 'white', fontSize: '20px', fontFamily: 'Horizon', width: isPC?'70%':'90%', textAlign: 'center' }}>
                            Suspendisse potenti. Quisque tristique eros id dui ultrices fringilla. Vivamus luctus magna urna, at gravida turpis cursus eu. Donec nec eros lobortis, venenatis lectus vitae, sagittis velit. Nulla sed sollicitudin metus. Mauris eget finibus nisi, et convallis ex. Mauris enim nunc, molestie vel porta ac, aliquet sit amet mauris. Pellentesque id feugiat purus.
                        </Text>
                    </View>



                </View>
            </View>

        </View >
    );
};

export default GuideScreen;


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
