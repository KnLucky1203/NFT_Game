import { StyleSheet } from 'react-native';

export const colors = {
  mainColor: `white`,
  accent: `rgba(239, 88, 123, 1)`,
  borderColor: 'rgba(92, 92, 92, 1)'
}

export const fonts = {
  fantasy: 'fantasy',
}

export const redShadow = mainShadow('red')

export function redTextStroke() {
  return `2px ${colors.accent}`
}
export function mainShadow(color) {
  return `0px 0px 20px ${color}`
}

export const commonStyle = {
  // ----- Common Controls -----
  button: {
    padding: '14px',
    fontSize: '20px',
    color: 'white',
    backgroundColor: colors.accent,
    boxShadow: redShadow,
    borderRadius: '54px',
    cursor: 'pointer',
    fontFamily: 'Horizon'
  },
  toggleBtn1: {
    padding: '14px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: colors.accent,
    boxShadow: redShadow,
    borderRadius: '54px',
    cursor: 'pointer',
    fontFamily: 'Horizon'
  },
  toggleBtn2: {
    padding: '14px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: `rgba(188, 188, 188, 188)`,
    boxShadow: redShadow,
    borderRadius: '54px',
    cursor: 'pointer',
    fontFamily: 'Horizon'
  },
  border: '1px solid '+ colors.borderColor
  // ----- Header -----

};
