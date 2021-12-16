import React from 'react';
import { Theme, useTheme } from '@chakra-ui/react';

import { twoToneIconDefaultProps } from './default-props';
import FilledIcon from './FilledIcon';
import { TwoToneIconPropsWithSvgComponent } from './types';

function TwoToneIcon({
  mode,
  color,
  twoToneColor,
  style,
  ...rest
}: TwoToneIconPropsWithSvgComponent): JSX.Element {
  const { colors }: Theme = useTheme();

  const modeColors = {
    dark: {
      color: colors.whiteAlpha['700'],
      twoToneColor: colors.white,
    },
    light: {
      color: colors.gray['700'],
      twoToneColor: colors.gray['300'],
    },
  };

  const modeColor =
    mode === 'light' ? modeColors.light.color : modeColors.dark.color;
  const modeTwoToneColor =
    mode === 'light'
      ? modeColors.light.twoToneColor
      : modeColors.dark.twoToneColor;

  return (
    <FilledIcon
      {...rest}
      mode={mode}
      style={{
        fill: color || modeColor,
        color: twoToneColor || modeTwoToneColor,
        ...style,
      }}
    />
  );
}

TwoToneIcon.defaultProps = twoToneIconDefaultProps;

export default TwoToneIcon;
