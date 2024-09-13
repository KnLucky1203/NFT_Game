import { StyleSheet } from 'react-native';

export const colors = {
  mainColor: `white`,
  accent: `rgba(239, 88, 123, 1)`,
}

export const fonts = {
  fantasy: 'fantasy',
}

export const redShadow = mainShadow('red')

export function redTextStroke() {
  return `2px ${colors.accent}`
}
export function mainShadow(color) {
  return `0px 3px 10px ${color}`
}

export const commonStyle = {
  // ----- Common Controls -----
  button: {
    padding: '10px',
    marginTop: '20px',
    fontSize: '20px',
    color: 'white',
    backgroundColor: colors.accent,
    boxShadow: redShadow,
    borderRadius: '20px',
    cursor: 'pointer',
  }
  // ----- Header -----

};
